import { Type } from 'class-transformer';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    ValidateNested,
} from 'class-validator';

const PHONE = /^\+\d{10,15}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const STORE_ID = /^[a-z0-9-]{1,50}$/;
// Карта вбудовується лише з Google Maps
const MAP_URL = /^https:\/\/(www\.google\.com\/maps|maps\.google\.com)\//;
const LOGO = /^(\/|https:\/\/)\S+$/;

export class DayHoursDto {
    @Matches(TIME)
    from: string;

    @Matches(TIME)
    to: string;
}

export class ScheduleDto {
    // null — вихідний
    @IsOptional()
    @ValidateNested()
    @Type(() => DayHoursDto)
    weekdays: DayHoursDto | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => DayHoursDto)
    saturday: DayHoursDto | null;

    @IsOptional()
    @ValidateNested()
    @Type(() => DayHoursDto)
    sunday: DayHoursDto | null;
}

export class StoreDto {
    @Matches(STORE_ID)
    id: string;

    @IsString()
    @MinLength(1)
    @MaxLength(60)
    city: string;

    @IsString()
    @MinLength(1)
    @MaxLength(200)
    address: string;

    // Якщо не задано — карта будується за адресою
    @IsOptional()
    @MaxLength(2000)
    @Matches(MAP_URL)
    mapEmbedUrl?: string | null;

    @IsOptional()
    @MaxLength(500)
    @Matches(LOGO)
    logo?: string | null;
}

export class UpdateSiteSettingsDto {
    @IsString()
    @Matches(PHONE)
    phone1: string;

    @IsOptional()
    @Matches(PHONE)
    phone2?: string | null;

    @IsOptional()
    @IsEmail()
    email?: string | null;

    @IsOptional()
    @Matches(PHONE)
    messengerPhone?: string | null;

    @ValidateNested()
    @Type(() => ScheduleDto)
    schedule: ScheduleDto;

    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @ValidateNested({ each: true })
    @Type(() => StoreDto)
    stores: StoreDto[];

    @IsBoolean()
    citySelectorModal: boolean;

    @IsBoolean()
    citySwitcherHeader: boolean;
}
