import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsArray, ValidateNested, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

class SpecDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsString()
    key: string;

    @IsString()
    value: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SpecDto)
    specs?: SpecDto[];
}