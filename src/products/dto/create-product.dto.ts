import { IsString, IsOptional, IsBoolean, IsUUID, IsInt, IsArray, IsEnum, Min, Max } from 'class-validator';

enum ProductBadge {
    NEW = 'NEW',
    HIT = 'HIT',
    SALE = 'SALE',
}

export class CreateProductDto {
    @IsUUID()
    categoryId: string;

    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    discountPercent?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(ProductBadge, { each: true })
    badges?: ProductBadge[];

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    seoTitle?: string;

    @IsOptional()
    @IsString()
    seoDescription?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    targetGroupIds?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    materialIds?: string[];
}