import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
    private s3: S3Client;
    private bucket: string;

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) {
        this.bucket = this.config.get<string>('S3_BUCKET')!;

        this.s3 = new S3Client({
            region: this.config.get<string>('S3_REGION')!,
            credentials: {
                accessKeyId: this.config.get<string>('S3_ACCESS_KEY')!,
                secretAccessKey: this.config.get<string>('S3_SECRET_KEY')!,
            },
        });
    }

    private async deleteFromS3(key: string): Promise<void> {
        await this.s3.send(new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        }));
    }

    private productInclude = {
        category: { select: { id: true, name: true, slug: true } },
        targetGroups: { select: { id: true, name: true, slug: true } },
        materials: { select: { id: true, name: true, slug: true } },
    };

    async findAll(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        badge?: string;
        all?: boolean;
        page: number;
        limit: number;
    }) {
        const where: Prisma.ProductWhereInput = {
            ...(filters.all ? {} : { isActive: true }),
            ...(filters.categoryId && { categoryId: filters.categoryId }),
            ...(filters.targetGroupSlug && {
                targetGroups: { some: { slug: filters.targetGroupSlug } },
            }),
            ...(filters.materialSlug && {
                materials: { some: { slug: filters.materialSlug } },
            }),
            ...(filters.badge && {
                badges: { has: filters.badge as 'NEW' | 'HIT' | 'SALE' },
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

    async getCounts(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        badge?: string;
    }) {
        const baseWhere: Prisma.ProductWhereInput = {
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

            Promise.all(
                ['NEW', 'HIT', 'SALE'].map(async (badge) => ({
                    badge,
                    count: await this.prisma.product.count({
                        where: {
                            ...baseWhere,
                            badges: { has: badge as 'NEW' | 'HIT' | 'SALE' },
                        },
                    }),
                })),
            ),
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

    async findBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                ...this.productInclude,
                images: { orderBy: { sortOrder: 'asc' } },
                specs: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    create(dto: CreateProductDto) {
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

    async update(id: string, dto: UpdateProductDto) {
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

    async remove(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!product) throw new NotFoundException('Product not found');

        for (const image of product.images) {
            await this.deleteFromS3(image.s3Key).catch(() => {});
        }

        return this.prisma.product.delete({ where: { id } });
    }

    async addSpec(productId: string, dto: CreateSpecDto) {
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

    async updateSpec(specId: string, dto: UpdateSpecDto) {
        return this.prisma.productSpec.update({
            where: { id: specId },
            data: dto,
        });
    }

    async removeSpec(specId: string) {
        return this.prisma.productSpec.delete({ where: { id: specId } });
    }

    async findById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                ...this.productInclude,
                images: { orderBy: { sortOrder: 'asc' } },
                specs: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }
}