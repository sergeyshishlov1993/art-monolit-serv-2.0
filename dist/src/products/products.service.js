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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.productInclude = {
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
            ...(filters.badge && {
                badges: { has: filters.badge },
            }),
        };
        const skip = (filters.page - 1) * filters.limit;
        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    ...this.productInclude,
                    images: { where: { isMain: true }, take: 1 },
                    specs: { orderBy: { sortOrder: 'asc' } },
                    _count: { select: { images: true } },
                },
                orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
                skip,
                take: filters.limit,
            }),
            this.prisma.product.count({ where }),
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
        const [total, categories, materials, targetGroups, badges] = await Promise.all([
            this.prisma.product.count({ where: baseWhere }),
            this.prisma.category.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    slug: true,
                    _count: {
                        select: {
                            products: { where: { isActive: true } },
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
                            products: { where: baseWhere },
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
                            products: { where: baseWhere },
                        },
                    },
                },
                orderBy: { sortOrder: 'asc' },
            }),
            Promise.all(['NEW', 'HIT', 'SALE'].map(async (badge) => ({
                badge,
                count: await this.prisma.product.count({
                    where: {
                        ...baseWhere,
                        badges: { has: badge },
                    },
                }),
            }))),
        ]);
        return {
            total,
            categories: categories.map((c) => ({
                slug: c.slug,
                count: c._count.products,
            })),
            materials: materials.map((m) => ({
                slug: m.slug,
                count: m._count.products,
            })),
            targetGroups: targetGroups.map((tg) => ({
                slug: tg.slug,
                count: tg._count.products,
            })),
            badges: badges.map((b) => ({
                badge: b.badge,
                count: b.count,
            })),
        };
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                ...this.productInclude,
                images: { orderBy: { sortOrder: 'asc' } },
                specs: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    create(dto) {
        const { targetGroupIds, materialIds, ...data } = dto;
        return this.prisma.product.create({
            data: {
                ...data,
                ...(targetGroupIds && {
                    targetGroups: { connect: targetGroupIds.map((id) => ({ id })) },
                }),
                ...(materialIds && {
                    materials: { connect: materialIds.map((id) => ({ id })) },
                }),
            },
            include: this.productInclude,
        });
    }
    async update(id, dto) {
        await this.findById(id);
        const { targetGroupIds, materialIds, specs, ...data } = dto;
        return this.prisma.$transaction(async (tx) => {
            if (specs !== undefined) {
                await tx.productSpec.deleteMany({ where: { productId: id } });
                if (specs.length) {
                    await tx.productSpec.createMany({
                        data: specs.map((spec, index) => ({
                            productId: id,
                            key: spec.key,
                            value: spec.value,
                            sortOrder: spec.sortOrder ?? index,
                        })),
                    });
                }
            }
            return tx.product.update({
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
                    ...this.productInclude,
                    images: { orderBy: { sortOrder: 'asc' } },
                    specs: { orderBy: { sortOrder: 'asc' } },
                },
            });
        });
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        for (const image of product.images) {
            await this.deleteFromS3(image.s3Key).catch(() => { });
        }
        return this.prisma.product.delete({ where: { id } });
    }
    async setMainImage(productId, imageId) {
        await this.findById(productId);
        await this.prisma.$transaction([
            this.prisma.productImage.updateMany({
                where: { productId, isMain: true },
                data: { isMain: false },
            }),
            this.prisma.productImage.update({
                where: { id: imageId },
                data: { isMain: true },
            }),
        ]);
        return this.findById(productId);
    }
    async addSpec(productId, dto) {
        await this.findById(productId);
        const maxSort = await this.prisma.productSpec.aggregate({
            where: { productId },
            _max: { sortOrder: true },
        });
        return this.prisma.productSpec.create({
            data: {
                productId,
                key: dto.key,
                value: dto.value,
                sortOrder: dto.sortOrder ?? (maxSort._max.sortOrder ?? -1) + 1,
            },
        });
    }
    async updateSpec(specId, dto) {
        return this.prisma.productSpec.update({
            where: { id: specId },
            data: dto,
        });
    }
    async removeSpec(specId) {
        return this.prisma.productSpec.delete({ where: { id: specId } });
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                ...this.productInclude,
                images: { orderBy: { sortOrder: 'asc' } },
                specs: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ProductsService);
//# sourceMappingURL=products.service.js.map