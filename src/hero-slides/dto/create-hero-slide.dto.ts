import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateHeroSlideDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    subtitle?: string;

    @IsOptional()
    @IsString()
    buttonText?: string;

    @IsOptional()
    @IsString()
    buttonLink?: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}