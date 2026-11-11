import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TelegramService } from '../telegram/telegram.service'
import { CreateLeadDto } from './dto/create-lead.dto'
import { UpdateLeadDto } from './dto/update-lead.dto'

const PRODUCT_SELECT = {
    id: true,
    title: true,
    slug: true,
    category: { select: { slug: true } },
} as const

type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED'

type FindAllFilters = {
    status?: string
    source?: string
    search?: string
    page?: number
    limit?: number
}

type FindAllResult = {
    items: Awaited<ReturnType<LeadsService['findById']>>[]
    total: number
    page: number
    limit: number
    totalPages: number
}

@Injectable()
export class LeadsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly telegramService: TelegramService,
    ) {}

    async findAll(filters: FindAllFilters): Promise<FindAllResult> {
        const page: number = filters.page && filters.page > 0 ? filters.page : 1
        const limit: number = filters.limit && filters.limit > 0 ? filters.limit : 20
        const skip: number = (page - 1) * limit

        const where = {
            ...(filters.status && { status: filters.status as LeadStatus }),
            ...(filters.source && { source: filters.source }),
            ...(filters.search && {
                OR: [
                    { name: { contains: filters.search, mode: 'insensitive' as const } },
                    { phone: { contains: filters.search } },
                    { email: { contains: filters.search, mode: 'insensitive' as const } },
                ],
            }),
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.lead.findMany({
                where,
                include: {
                    product: { select: PRODUCT_SELECT },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.lead.count({
                where,
            }),
        ])

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        }
    }

    async stats() {
        const days = 14;
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' });

        const [bySource, byStatus, byUtm, rows] = await Promise.all([
            this.prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
            this.prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
            this.prisma.lead.groupBy({ by: ['utmSource', 'utmCampaign'], where: { utmSource: { not: null } }, _count: { _all: true } }),
            this.prisma.$queryRaw<{ day: string; count: number }[]>`
                SELECT to_char(("createdAt" AT TIME ZONE 'Europe/Kyiv')::date, 'YYYY-MM-DD') AS day, count(*)::int AS count
                FROM leads
                WHERE "createdAt" >= now() - interval '15 days'
                GROUP BY 1`,
        ]);

        const counts = new Map(rows.map((row) => [row.day, row.count]));
        const byDay = Array.from({ length: days }, (_, index) => {
            const date = formatter.format(new Date(Date.now() - (days - 1 - index) * 24 * 60 * 60 * 1000));
            return { date, count: counts.get(date) ?? 0 };
        });

        return {
            total: byStatus.reduce((sum, item) => sum + item._count._all, 0),
            byDay,
            bySource: bySource
                .map((item) => ({ source: item.source, count: item._count._all }))
                .sort((first, second) => second.count - first.count),
            byUtm: byUtm
                .map((item) => ({ source: item.utmSource ?? '', campaign: item.utmCampaign, count: item._count._all }))
                .sort((first, second) => second.count - first.count)
                .slice(0, 8),
            byStatus: byStatus.map((item) => ({ status: item.status, count: item._count._all })),
        };
    }

    async findById(id: string) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                product: { select: PRODUCT_SELECT },
            },
        })

        if (!lead) {
            throw new NotFoundException('Lead not found')
        }

        return lead
    }

    async create(dto: CreateLeadDto) {
        const { website, ...data } = dto

        // Honeypot заповнений — це бот: відповідаємо успіхом, але нічого не зберігаємо
        if (website) {
            return { ok: true }
        }

        const lead = await this.prisma.lead.create({
            data,
            include: {
                product: { select: PRODUCT_SELECT },
            },
        })

        this.telegramService.sendLeadNotification({
            name: lead.name,
            phone: lead.phone,
            message: lead.message,
            source: lead.source,
            pixel: lead.pixel,
            utmSource: lead.utmSource,
            utmMedium: lead.utmMedium,
            utmCampaign: lead.utmCampaign,
            product: lead.product,
        })

        return lead
    }

    async update(id: string, dto: UpdateLeadDto) {
        await this.findById(id)

        return this.prisma.lead.update({
            where: { id },
            data: dto,
            include: {
                product: { select: PRODUCT_SELECT },
            },
        })
    }

    async remove(id: string) {
        await this.findById(id)

        return this.prisma.lead.delete({
            where: { id },
        })
    }
}