import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateSpecDto } from './dto/create-spec.dto';
import { UpdateSpecDto } from './dto/update-spec.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    getCounts(categoryId?: string, targetGroupSlug?: string, materialSlug?: string, badge?: string): Promise<{
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
    findAll(categoryId?: string, targetGroupSlug?: string, materialSlug?: string, badge?: string, all?: string, page?: string, limit?: string): Promise<{
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
                isMain: boolean;
                productId: string;
                s3Key: string;
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
    create(dto: CreateProductDto): import(".prisma/client").Prisma.Prisma__ProductClient<{
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
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    addSpec(id: string, dto: CreateSpecDto): Promise<{
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
    update(id: string, dto: UpdateProductDto): Promise<{
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
            isMain: boolean;
            productId: string;
            s3Key: string;
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
            isMain: boolean;
            productId: string;
            s3Key: string;
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
    findBySlug(slug: string): Promise<{
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
            isMain: boolean;
            productId: string;
            s3Key: string;
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
