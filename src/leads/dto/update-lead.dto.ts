import { IsString, IsOptional, IsEnum } from 'class-validator';

enum LeadStatus {
    NEW = 'NEW',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELED = 'CANCELED',
}

export class UpdateLeadDto {
    @IsOptional()
    @IsEnum(LeadStatus)
    status?: LeadStatus;

    @IsOptional()
    @IsString()
    adminComment?: string;
}