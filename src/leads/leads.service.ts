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
        const lead = await this.prisma.lead.create({
            data: dto,
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