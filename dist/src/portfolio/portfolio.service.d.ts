import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Prisma } from '@prisma/client';
export declare class PortfolioService {
    private prisma;
    private config;
    private s3;
    private bucket;
    constructor(prisma: PrismaService, config: ConfigService);
    private deleteFromS3;
    private workInclude;
    findAll(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        all?: boolean;
        page: number;
        limit: number;
    }): Promise<{
        items: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            _count: {
                images: number;
            };
            targetGroups: {
                id: string;
                name: string;
                slug: string;
            }[];
            materials: {
                id: string;
                name: string;
                slug: string;
            }[];
            images: {
                url: string;
                id: string;
                createdAt: Date;
                sortOrder: number;
                s3Key: string;
                alt: string | null;
                portfolioWorkId: string;
            }[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            categoryId: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getCounts(filters: {
        categoryId?: string;
    }): Promise<{
        total: number;
        categories: {
            slug: string;
            count: number;
        }[];
        materials: {
            slug: string;
            count: number;
        }[];
        targetGroups: {
            slug: string;
            count: number;
        }[];
    }>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        targetGroups: {
            id: string;
            name: string;
            slug: string;
        }[];
        materials: {
            id: string;
            name: string;
            slug: string;
        }[];
        images: {
            url: string;
            id: string;
            createdAt: Date;
            sortOrder: number;
            s3Key: string;
            alt: string | null;
            portfolioWorkId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        categoryId: string;
    }>;
    create(dto: CreatePortfolioDto): Prisma.Prisma__PortfolioWorkClient<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        targetGroups: {
            id: string;
            name: string;
            slug: string;
        }[];
        materials: {
            id: string;
            name: string;
            slug: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        categoryId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdatePortfolioDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        targetGroups: {
            id: string;
            name: string;
            slug: string;
        }[];
        materials: {
            id: string;
            name: string;
            slug: string;
        }[];
        images: {
            url: string;
            id: string;
            createdAt: Date;
            sortOrder: number;
            s3Key: string;
            alt: string | null;
            portfolioWorkId: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        categoryId: string;
    }>;
}
