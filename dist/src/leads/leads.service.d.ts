import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
export declare class LeadsService {
    private prisma;
    private telegramService;
    constructor(prisma: PrismaService, telegramService: TelegramService);
    findAll(filters: {
        status?: string;
        source?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
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
        adminComment: string | null;
        productId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        message: string | null;
        source: string;
        pixel: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
    })[]>;
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
        adminComment: string | null;
        productId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        message: string | null;
        source: string;
        pixel: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
    }>;
    create(dto: CreateLeadDto): Promise<{
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
        adminComment: string | null;
        productId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        message: string | null;
        source: string;
        pixel: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
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
        adminComment: string | null;
        productId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        message: string | null;
        source: string;
        pixel: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
    }>;
    remove(id: string): Promise<{
        number: number;
        adminComment: string | null;
        productId: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
        message: string | null;
        source: string;
        pixel: string | null;
        status: import(".prisma/client").$Enums.LeadStatus;
    }>;
}
