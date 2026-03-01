import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

const PRODUCT_SELECT = {
    id: true,
    title: true,
    slug: true,
    category: { select: { slug: true } },
};

@Injectable()
export class LeadsService {
    constructor(
        private prisma: PrismaService,
        private telegramService: TelegramService,
    ) {}

    findAll(filters: { status?: string; source?: string }) {
        return this.prisma.lead.findMany({
            where: {
                ...(filters.status && { status: filters.status as 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELED' }),
                ...(filters.source && { source: filters.source }),
            },
            include: {
                product: { select: PRODUCT_SELECT },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });
        if (!lead) throw new NotFoundException('Lead not found');
        return lead;
    }

    async create(dto: CreateLeadDto) {
        const lead = await this.prisma.lead.create({
            data: dto,
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });

        this.telegramService.sendLeadNotification({
            name: lead.name,
            phone: lead.phone,
            message: lead.message,
            source: lead.source,
            pixel: lead.pixel,
            product: lead.product,
        });

        return lead;
    }

    async update(id: string, dto: UpdateLeadDto) {
        await this.findById(id);
        return this.prisma.lead.update({
            where: { id },
            data: dto,
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });
    }

    async remove(id: string) {
        await this.findById(id);
        return this.prisma.lead.delete({ where: { id } });
    }
}