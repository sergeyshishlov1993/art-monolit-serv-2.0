import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
import { Prisma } from '@prisma/client';
export declare class ProductsService {
    private prisma;
    private config;
    private s3;
    private bucket;
    constructor(prisma: PrismaService, config: ConfigService);
    private deleteFromS3;
    private productInclude;
    findAll(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        badge?: string;
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
            specs: {
                productId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                key: string;
                value: string;
            }[];
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
                productId: string;
                id: string;
                createdAt: Date;
                sortOrder: number;
                isMain: boolean;
                s3Key: string;
                alt: string | null;
            }[];
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            categoryId: string;
            title: string;
            discountPercent: number | null;
            badges: import(".prisma/client").$Enums.ProductBadge[];
            seoTitle: string | null;
            seoDescription: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    }>;
    getCounts(filters: {
        categoryId?: string;
        targetGroupSlug?: string;
        materialSlug?: string;
        badge?: string;
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
        badges: {
            badge: string;
            count: number;
        }[];
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        specs: {
            productId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            key: string;
            value: string;
        }[];
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
            productId: string;
            id: string;
            createdAt: Date;
            sortOrder: number;
            isMain: boolean;
            s3Key: string;
            alt: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        title: string;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        seoTitle: string | null;
        seoDescription: string | null;
    }>;
    create(dto: CreateProductDto): Prisma.Prisma__ProductClient<{
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
        slug: string;
        description: string | null;
        categoryId: string;
        title: string;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        seoTitle: string | null;
        seoDescription: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        specs: {
            productId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            key: string;
            value: string;
        }[];
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
            productId: string;
            id: string;
            createdAt: Date;
            sortOrder: number;
            isMain: boolean;
            s3Key: string;
            alt: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        title: string;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        seoTitle: string | null;
        seoDescription: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        title: string;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        seoTitle: string | null;
        seoDescription: string | null;
    }>;
    addSpec(productId: string, dto: CreateSpecDto): Promise<{
        productId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        key: string;
        value: string;
    }>;
    updateSpec(specId: string, dto: UpdateSpecDto): Promise<{
        productId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        key: string;
        value: string;
    }>;
    removeSpec(specId: string): Promise<{
        productId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        key: string;
        value: string;
    }>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        specs: {
            productId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            key: string;
            value: string;
        }[];
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
            productId: string;
            id: string;
            createdAt: Date;
            sortOrder: number;
            isMain: boolean;
            s3Key: string;
            alt: string | null;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        categoryId: string;
        title: string;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        seoTitle: string | null;
        seoDescription: string | null;
    }>;
}
