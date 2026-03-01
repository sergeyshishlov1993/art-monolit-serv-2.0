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
exports.PortfolioService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_service_1 = require("../prisma/prisma.service");
let PortfolioService = class PortfolioService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.workInclude = {
            category: { select: { id: true, name: true, slug: true } },
            targetGroups: { select: { id: true, name: true, slug: true } },
            materials: { select: { id: true, name: true, slug: true } },
        };
        this.bucket = this.config.get('S3_BUCKET');
        this.s3 = new client_s3_1.S3Client({
            region: this.config.get('S3_REGION'),
            credentials: {
                accessKeyId: this.config.get('S3_ACCESS_KEY'),
                secretAccessKey: this.config.get('S3_SECRET_KEY'),
            },
        });
    }
    async deleteFromS3(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }
    async findAll(filters) {
        const where = {
            ...(filters.all ? {} : { isActive: true }),
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.targetGroupSlug && {
                targetGroups: { some: { slug: filters.targetGroupSlug } },
            }),
            ...(filters.materialSlug && {
                materials: { some: { slug: filters.materialSlug } },
            }),
        };
        const skip = (filters.page - 1) * filters.limit;
        const [items, total] = await Promise.all([
            this.prisma.portfolioWork.findMany({
                where,
                include: {
                    ...this.workInclude,
                    images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                    _count: { select: { images: true } },
                },
                orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
                skip,
                take: filters.limit,
            }),
            this.prisma.portfolioWork.count({ where }),
        ]);
        return {
            items,
            total,
            page: filters.page,
            limit: filters.limit,
            totalPages: Math.ceil(total / filters.limit),
            hasMore: skip + items.length < total,
        };
    }
    async getCounts(filters) {
        const baseWhere = {
            isActive: true,
            ...(filters.categoryId && { categoryId: filters.categoryId }),
        };
        const [total, categories, materials, targetGroups] = await Promise.all([
            this.prisma.portfolioWork.count({ where: baseWhere }),
            this.prisma.category.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    slug: true,
                    _count: {
                        select: {
                            portfolioWorks: { where: { isActive: true } },
                        },
                    },
                },
                orderBy: { sortOrder: 'asc' },
            }),
            this.prisma.material.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    slug: true,
                    _count: {
                        select: {
                            portfolioWorks: { where: baseWhere },
                        },
                    },
                },
                orderBy: { sortOrder: 'asc' },
            }),
            this.prisma.targetGroup.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    slug: true,
                    _count: {
                        select: {
                            portfolioWorks: { where: baseWhere },
                        },
                    },
                },
                orderBy: { sortOrder: 'asc' },
            }),
        ]);
        return {
            total,
            categories: categories.map((c) => ({
                slug: c.slug,
                count: c._count.portfolioWorks,
            })),
            materials: materials.map((m) => ({
                slug: m.slug,
                count: m._count.portfolioWorks,
            })),
            targetGroups: targetGroups.map((tg) => ({
                slug: tg.slug,
                count: tg._count.portfolioWorks,
            })),
        };
    }
    async findById(id) {
        const work = await this.prisma.portfolioWork.findUnique({
            where: { id },
            include: {
                ...this.workInclude,
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!work)
            throw new common_1.NotFoundException('Portfolio work not found');
        return work;
    }
    create(dto) {
        const { targetGroupIds, materialIds, categoryId, sortOrder, isActive } = dto;
        return this.prisma.portfolioWork.create({
            data: {
                categoryId,
                sortOrder: sortOrder ?? 0,
                isActive: isActive ?? true,
                ...(targetGroupIds?.length && {
                    targetGroups: { connect: targetGroupIds.map((id) => ({ id })) },
                }),
                ...(materialIds?.length && {
                    materials: { connect: materialIds.map((id) => ({ id })) },
                }),
            },
            include: this.workInclude,
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const { targetGroupIds, materialIds, ...data } = dto;
        return this.prisma.portfolioWork.update({
            where: { id },
            data: {
                ...data,
                ...(targetGroupIds !== undefined && {
                    targetGroups: { set: targetGroupIds.map((id) => ({ id })) },
                }),
                ...(materialIds !== undefined && {
                    materials: { set: materialIds.map((id) => ({ id })) },
                }),
            },
            include: {
                ...this.workInclude,
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
    }
    async remove(id) {
        const work = await this.prisma.portfolioWork.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!work)
            throw new common_1.NotFoundException('Portfolio work not found');
        for (const image of work.images) {
            await this.deleteFromS3(image.s3Key).catch(() => { });
        }
        return this.prisma.portfolioWork.delete({ where: { id } });
    }
};
exports.PortfolioService = PortfolioService;
exports.PortfolioService = PortfolioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PortfolioService);
//# sourceMappingURL=portfolio.service.js.map