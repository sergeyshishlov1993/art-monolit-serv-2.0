"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LeadReminderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadReminderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const site_settings_service_1 = require("../site-settings/site-settings.service");
const telegram_service_1 = require("../telegram/telegram.service");
const working_hours_1 = require("./working-hours");
const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const OVERDUE_AFTER_MS = 30 * 60 * 1000;
const IGNORE_OLDER_THAN_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_LEADS_PER_MESSAGE = 20;
let LeadReminderService = LeadReminderService_1 = class LeadReminderService {
    constructor(prisma, telegram, settings, config) {
        this.prisma = prisma;
        this.telegram = telegram;
        this.settings = settings;
        this.config = config;
        this.logger = new common_1.Logger(LeadReminderService_1.name);
    }
    onModuleInit() {
        if (this.config.get('LEAD_REMINDER_ENABLED') !== 'true') {
            this.logger.log('Нагадування про заявки вимкнені (LEAD_REMINDER_ENABLED != true)');
            return;
        }
        this.timer = setInterval(() => {
            this.check().catch((error) => this.logger.error('Помилка перевірки заявок', error));
        }, CHECK_INTERVAL_MS);
    }
    onModuleDestroy() {
        if (this.timer)
            clearInterval(this.timer);
    }
    async check(now = new Date()) {
        const { schedule } = await this.settings.get();
        if (!(0, working_hours_1.isWorkingTime)(schedule, now))
            return 0;
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
        if (!leads.length)
            return 0;
        const sent = await this.telegram.sendOverdueLeadsReminder(leads);
        if (!sent)
            return 0;
        await this.prisma.lead.updateMany({
            where: { id: { in: leads.map((lead) => lead.id) } },
            data: { reminderSentAt: now },
        });
        return leads.length;
    }
};
exports.LeadReminderService = LeadReminderService;
exports.LeadReminderService = LeadReminderService = LeadReminderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        telegram_service_1.TelegramService,
        site_settings_service_1.SiteSettingsService,
        config_1.ConfigService])
], LeadReminderService);
//# sourceMappingURL=lead-reminder.service.js.map