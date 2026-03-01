import { CreateProductDto } from './create-product.dto';
declare class SpecDto {
    id?: string;
    key: string;
    value: string;
    sortOrder?: number;
}
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    specs?: SpecDto[];
}
export {};
