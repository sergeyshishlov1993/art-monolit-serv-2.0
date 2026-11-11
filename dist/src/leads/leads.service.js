"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const telegram_service_1 = require("../telegram/telegram.service");
const PRODUCT_SELECT = {
    id: true,
    title: true,
    slug: true,
    category: { select: { slug: true } },
};
let LeadsService = class LeadsService {
    constructor(prisma, telegramService) {
        this.prisma = prisma;
        this.telegramService = telegramService;
    }
    async findAll(filters) {
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;
        const skip = (page - 1) * limit;
        const where = {
            ...(filters.status && { status: filters.status }),
            ...(filters.source && { source: filters.source }),
            ...(filters.search && {
                OR: [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { phone: { contains: filters.search } },
                    { email: { contains: filters.search, mode: 'insensitive' } },
                ],
            }),
        };
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
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async stats() {
        const days = 14;
        const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' });
        const [bySource, byStatus, byUtm, rows] = await Promise.all([
            this.prisma.lead.groupBy({ by: ['source'], _count: { _all: true } }),
            this.prisma.lead.groupBy({ by: ['status'], _count: { _all: true } }),
            this.prisma.lead.groupBy({ by: ['utmSource', 'utmCampaign'], where: { utmSource: { not: null } }, _count: { _all: true } }),
            this.prisma.$queryRaw `
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
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });
        if (!lead) {
            throw new common_1.NotFoundException('Lead not found');
        }
        return lead;
    }
    async create(dto) {
        const { website, ...data } = dto;
        if (website) {
            return { ok: true };
        }
        const lead = await this.prisma.lead.create({
            data,
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
            utmSource: lead.utmSource,
            utmMedium: lead.utmMedium,
            utmCampaign: lead.utmCampaign,
            product: lead.product,
        });
        return lead;
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.lead.update({
            where: { id },
            data: dto,
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.lead.delete({
            where: { id },
        });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map