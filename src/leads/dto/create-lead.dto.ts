import { IsString, IsOptional, IsUUID, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    phone: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    message?: string;

    @IsOptional()
    @IsUUID()
    productId?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    source?: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    pixel?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    utmSource?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    utmMedium?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    utmCampaign?: string;

    // Honeypot: людина не бачить це поле, боти його заповнюють
    @IsOptional()
    @IsString()
    @MaxLength(200)
    website?: string;
}
