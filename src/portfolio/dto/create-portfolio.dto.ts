import { IsBoolean, IsUUID, IsInt, IsArray, IsOptional, Min } from 'class-validator';

export class CreatePortfolioDto {
    @IsUUID()
    categoryId: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    targetGroupIds?: string[];

    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    materialIds?: string[];
}