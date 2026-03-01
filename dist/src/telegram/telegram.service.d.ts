import { ConfigService } from '@nestjs/config';
interface LeadNotification {
    name: string;
    phone: string;
    message?: string | null;
    source?: string | null;
    pixel?: string | null;
    product?: {
        title: string;
        slug: string;
        category?: {
            slug: string;
        } | null;
    } | null;
}
export declare class TelegramService {
    private configService;
    private readonly logger;
    private readonly botToken;
    private readonly chatId;
    private readonly siteUrl;
    constructor(configService: ConfigService);
    sendLeadNotification(lead: LeadNotification): Promise<void>;
}
export {};
