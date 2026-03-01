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
    findAll(filters) {
        return this.prisma.lead.findMany({
            where: {
                ...(filters.status && { status: filters.status }),
                ...(filters.source && { source: filters.source }),
            },
            include: {
                product: { select: PRODUCT_SELECT },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findById(id) {
        const lead = await this.prisma.lead.findUnique({
            where: { id },
            include: {
                product: { select: PRODUCT_SELECT },
            },
        });
        if (!lead)
            throw new common_1.NotFoundException('Lead not found');
        return lead;
    }
    async create(dto) {
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
        return this.prisma.lead.delete({ where: { id } });
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService])
], LeadsService);
//# sourceMappingURL=leads.service.js.map