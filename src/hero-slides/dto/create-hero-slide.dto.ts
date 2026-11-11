import { IsString, IsOptional, IsInt, IsBoolean, Matches } from 'class-validator';

const FOCUS_PATTERN = /^(100|\d{1,2})% (100|\d{1,2})%$/;

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
    @Matches(FOCUS_PATTERN)
    focusDesktop?: string;

    @IsOptional()
    @Matches(FOCUS_PATTERN)
    focusTablet?: string;

    @IsOptional()
    @Matches(FOCUS_PATTERN)
    focusMobile?: string;

    @IsOptional()
    @IsInt()
    sortOrder?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}