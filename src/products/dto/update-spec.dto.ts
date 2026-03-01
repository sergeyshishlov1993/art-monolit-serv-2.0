import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateSpecDto {
    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    value?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}