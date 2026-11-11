import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
export type DayHours = {
    from: string;
    to: string;
} | null;
export type Schedule = {
    weekdays: DayHours;
    saturday: DayHours;
    sunday: DayHours;
};
export type Store = {
    id: string;
    city: string;
    address: string;
    mapEmbedUrl: string | null;
    logo: string | null;
};
export declare const DEFAULT_SETTINGS: {
    phone1: string;
    phone2: string;
    email: string;
    messengerPhone: string;
    schedule: Schedule;
    stores: Store[];
    citySelectorModal: boolean;
    citySwitcherHeader: boolean;
};
export declare class SiteSettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(): Promise<{
        phone1: string;
        phone2: string | null;
        email: string | null;
        messengerPhone: string | null;
        schedule: Schedule;
        stores: Store[];
        citySelectorModal: boolean;
        citySwitcherHeader: boolean;
    }>;
    update(dto: UpdateSiteSettingsDto): Promise<{
        phone1: string;
        phone2: string | null;
        email: string | null;
        messengerPhone: string | null;
        schedule: Schedule;
        stores: Store[];
        citySelectorModal: boolean;
        citySwitcherHeader: boolean;
    }>;
}
