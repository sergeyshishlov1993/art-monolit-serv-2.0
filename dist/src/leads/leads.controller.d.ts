import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsController {
    private leadsService;
    constructor(leadsService: LeadsService);
    create(dto: CreateLeadDto): Promise<({
        product: {
            category: {
                slug: string;
            };
            id: string;
            slug: string;
            title: string;
        } | null;
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string | null;
        phone: string;
        message: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        source: string;
        pixel: string | null;
        adminComment: string | null;
        reminderSentAt: Date | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
    }) | {
        ok: boolean;
    }>;
    findAll(status?: string, source?: string, search?: string, page?: string, limit?: string): Promise<{
        items: Awaited<ReturnType<LeadsService["findById"]>>[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    stats(): Promise<{
        total: number;
        byDay: {
            date: string;
            count: number;
        }[];
        bySource: {
            source: string;
            count: number;
        }[];
        byUtm: {
            source: string;
            campaign: string | null;
            count: number;
        }[];
        byStatus: {
            status: import(".prisma/client").$Enums.LeadStatus;
            count: number;
        }[];
    }>;
    findById(id: string): Promise<{
        product: {
            category: {
                slug: string;
            };
            id: string;
            slug: string;
            title: string;
        } | null;
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string | null;
        phone: string;
        message: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        source: string;
        pixel: string | null;
        adminComment: string | null;
        reminderSentAt: Date | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
    }>;
    update(id: string, dto: UpdateLeadDto): Promise<{
        product: {
            category: {
                slug: string;
            };
            id: string;
            slug: string;
            title: string;
        } | null;
    } & {
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string | null;
        phone: string;
        message: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        source: string;
        pixel: string | null;
        adminComment: string | null;
        reminderSentAt: Date | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
    }>;
    remove(id: string): Promise<{
        number: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        productId: string | null;
        phone: string;
        message: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
        source: string;
        pixel: string | null;
        adminComment: string | null;
        reminderSentAt: Date | null;
        utmSource: string | null;
        utmMedium: string | null;
        utmCampaign: string | null;
    }>;
}
