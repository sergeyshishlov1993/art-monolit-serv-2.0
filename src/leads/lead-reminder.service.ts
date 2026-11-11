import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SiteSettingsService } from '../site-settings/site-settings.service';
import { TelegramService } from '../telegram/telegram.service';
import { isWorkingTime } from './working-hours';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const OVERDUE_AFTER_MS = 30 * 60 * 1000;
const IGNORE_OLDER_THAN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_LEADS_PER_MESSAGE = 20;

// Нагадує в Telegram про заявки зі статусом NEW, які ніхто не взяв у роботу за 30 хвилин у робочий час.
// Вмикається лише змінною LEAD_REMINDER_ENABLED=true, щоб локальна база не слала повідомлення в бойовий чат.
@Injectable()
export class LeadReminderService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(LeadReminderService.name);
    private timer?: NodeJS.Timeout;

    constructor(
        private readonly prisma: PrismaService,
        private readonly telegram: TelegramService,
        private readonly settings: SiteSettingsService,
        private readonly config: ConfigService,
    ) {}

    onModuleInit(): void {
        if (this.config.get<string>('LEAD_REMINDER_ENABLED') !== 'true') {
            this.logger.log('Нагадування про заявки вимкнені (LEAD_REMINDER_ENABLED != true)');
            return;
        }

        this.timer = setInterval(() => {
            this.check().catch((error) => this.logger.error('Помилка перевірки заявок', error));
        }, CHECK_INTERVAL_MS);
    }

    onModuleDestroy(): void {
        if (this.timer) clearInterval(this.timer);
    }

    // Повертає кількість заявок, про які надіслано нагадування
    async check(now: Date = new Date()): Promise<number> {
        const { schedule } = await this.settings.get();
        if (!isWorkingTime(schedule, now)) return 0;

        const leads = await this.prisma.lead.findMany({
            where: {
                status: 'NEW',
                reminderSentAt: null,
                createdAt: {
                    lt: new Date(now.getTime() - OVERDUE_AFTER_MS),
                    gt: new Date(now.getTime() - IGNORE_OLDER_THAN_MS),
                },
            },
            orderBy: { createdAt: 'asc' },
            take: MAX_LEADS_PER_MESSAGE,
            select: { id: true, number: true, name: true, phone: true, createdAt: true },
        });

        if (!leads.length) return 0;

        const sent = await this.telegram.sendOverdueLeadsReminder(leads);
        if (!sent) return 0;

        await this.prisma.lead.updateMany({
            where: { id: { in: leads.map((lead) => lead.id) } },
            data: { reminderSentAt: now },
        });

        return leads.length;
    }
}
