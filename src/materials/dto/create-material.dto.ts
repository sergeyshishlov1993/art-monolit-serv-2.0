import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateMaterialDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}