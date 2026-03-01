import { IsString, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    name: string;

    @IsString()
    phone: string;

    @IsOptional()
    
    @IsOptional()
    @IsString()
    message?: string;

    @IsOptional()
    @IsUUID()
    productId?: string;

    @IsOptional()
    @IsString()
    source?: string;

    @IsOptional()
    @IsString()
    pixel?: string;
}