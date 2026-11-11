export declare class DayHoursDto {
    from: string;
    to: string;
}
export declare class ScheduleDto {
    weekdays: DayHoursDto | null;
    saturday: DayHoursDto | null;
    sunday: DayHoursDto | null;
}
export declare class StoreDto {
    id: string;
    city: string;
    address: string;
    mapEmbedUrl?: string | null;
    logo?: string | null;
}
export declare class UpdateSiteSettingsDto {
    phone1: string;
    phone2?: string | null;
    email?: string | null;
    messengerPhone?: string | null;
    schedule: ScheduleDto;
    stores: StoreDto[];
    citySelectorModal: boolean;
    citySwitcherHeader: boolean;
}
