declare enum ProductBadge {
    NEW = "NEW",
    HIT = "HIT",
    SALE = "SALE"
}
export declare class CreateProductDto {
    categoryId: string;
    title: string;
    slug: string;
    description?: string;
    discountPercent?: number;
    badges?: ProductBadge[];
    isActive?: boolean;
    seoTitle?: string;
    seoDescription?: string;
    targetGroupIds?: string[];
    materialIds?: string[];
}
export {};
