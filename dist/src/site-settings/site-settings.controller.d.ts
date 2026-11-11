import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';
export declare class SiteSettingsController {
    private readonly siteSettingsService;
    constructor(siteSettingsService: SiteSettingsService);
    get(): Promise<{
        phone1: string;
        phone2: string | null;
        email: string | null;
        messengerPhone: string | null;
        schedule: import("./site-settings.service").Schedule;
        stores: import("./site-settings.service").Store[];
        citySelectorModal: boolean;
        citySwitcherHeader: boolean;
    }>;
    update(dto: UpdateSiteSettingsDto): Promise<{
        phone1: string;
        phone2: string | null;
        email: string | null;
        messengerPhone: string | null;
        schedule: import("./site-settings.service").Schedule;
        stores: import("./site-settings.service").Store[];
        citySelectorModal: boolean;
        citySwitcherHeader: boolean;
    }>;
}
