import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SiteSettingsService } from '../site-settings/site-settings.service';
import { TelegramService } from '../telegram/telegram.service';
export declare class LeadReminderService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly telegram;
    private readonly settings;
    private readonly config;
    private readonly logger;
    private timer?;
    constructor(prisma: PrismaService, telegram: TelegramService, settings: SiteSettingsService, config: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
    check(now?: Date): Promise<number>;
}
