import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortfolioService {
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

    private workInclude = {
        category: { select: { id: true, name: true, slug: true } },
        targetGroups: { select: { id: true, name: true, slug: true } },
        materials: { select: { id: true, name: true, slug: true } },
    };

    async findAll(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        all?: boolean;
        page: number;
        limit: number;
    }) {
        const where: Prisma.PortfolioWorkWhereInput = {
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

    async getCounts(filters: { categoryId?: string }) {
        const baseWhere: Prisma.PortfolioWorkWhereInput = {
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

    async findById(id: string) {
        const work = await this.prisma.portfolioWork.findUnique({
            where: { id },
            include: {
                ...this.workInclude,
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!work) throw new NotFoundException('Portfolio work not found');
        return work;
    }

    create(dto: CreatePortfolioDto) {
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

    async update(id: string, dto: UpdatePortfolioDto) {
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

    async remove(id: string) {
        const work = await this.prisma.portfolioWork.findUnique({
            where: { id },
            include: { images: true },
        });
        if (!work) throw new NotFoundException('Portfolio work not found');

        for (const image of work.images) {
            await this.deleteFromS3(image.s3Key).catch(() => {});
        }

        return this.prisma.portfolioWork.delete({ where: { id } });
    }
}