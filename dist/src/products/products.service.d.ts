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
                slug: string;
                name: string;
            };
            targetGroups: {
                id: string;
                slug: string;
                name: string;
            }[];
            materials: {
                id: string;
                slug: string;
                name: string;
            }[];
            images: {
                id: string;
                createdAt: Date;
                isMain: boolean;
                sortOrder: number;
                productId: string;
                s3Key: string;
                url: string;
                alt: string | null;
            }[];
            specs: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                sortOrder: number;
                productId: string;
                key: string;
                value: string;
            }[];
            _count: {
                images: number;
            };
        } & {
            id: string;
            categoryId: string;
            title: string;
            slug: string;
            description: string | null;
            discountPercent: number | null;
            badges: import(".prisma/client").$Enums.ProductBadge[];
            isActive: boolean;
            seoTitle: string | null;
            seoDescription: string | null;
            createdAt: Date;
            updatedAt: Date;
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
            slug: string;
            name: string;
        };
        targetGroups: {
            id: string;
            slug: string;
            name: string;
        }[];
        materials: {
            id: string;
            slug: string;
            name: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            isMain: boolean;
            sortOrder: number;
            productId: string;
            s3Key: string;
            url: string;
            alt: string | null;
        }[];
        specs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            productId: string;
            key: string;
            value: string;
        }[];
    } & {
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Prisma.Prisma__ProductClient<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        targetGroups: {
            id: string;
            slug: string;
            name: string;
        }[];
        materials: {
            id: string;
            slug: string;
            name: string;
        }[];
    } & {
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        targetGroups: {
            id: string;
            slug: string;
            name: string;
        }[];
        materials: {
            id: string;
            slug: string;
            name: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            isMain: boolean;
            sortOrder: number;
            productId: string;
            s3Key: string;
            url: string;
            alt: string | null;
        }[];
        specs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            productId: string;
            key: string;
            value: string;
        }[];
    } & {
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setMainImage(productId: string, imageId: string): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        targetGroups: {
            id: string;
            slug: string;
            name: string;
        }[];
        materials: {
            id: string;
            slug: string;
            name: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            isMain: boolean;
            sortOrder: number;
            productId: string;
            s3Key: string;
            url: string;
            alt: string | null;
        }[];
        specs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            productId: string;
            key: string;
            value: string;
        }[];
    } & {
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addSpec(productId: string, dto: CreateSpecDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        productId: string;
        key: string;
        value: string;
    }>;
    updateSpec(specId: string, dto: UpdateSpecDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        productId: string;
        key: string;
        value: string;
    }>;
    removeSpec(specId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        productId: string;
        key: string;
        value: string;
    }>;
    findById(id: string): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        targetGroups: {
            id: string;
            slug: string;
            name: string;
        }[];
        materials: {
            id: string;
            slug: string;
            name: string;
        }[];
        images: {
            id: string;
            createdAt: Date;
            isMain: boolean;
            sortOrder: number;
            productId: string;
            s3Key: string;
            url: string;
            alt: string | null;
        }[];
        specs: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            sortOrder: number;
            productId: string;
            key: string;
            value: string;
        }[];
    } & {
        id: string;
        categoryId: string;
        title: string;
        slug: string;
        description: string | null;
        discountPercent: number | null;
        badges: import(".prisma/client").$Enums.ProductBadge[];
        isActive: boolean;
        seoTitle: string | null;
        seoDescription: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
