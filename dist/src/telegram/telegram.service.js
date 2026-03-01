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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.siteUrl = 'https://www.art-monolit.com.ua';
        this.botToken = this.configService.getOrThrow('TELEGRAM_BOT_TOKEN');
        this.chatId = this.configService.getOrThrow('TELEGRAM_CHAT_ID');
    }
    async sendLeadNotification(lead) {
        let productLink = '—';
        if (lead.product) {
            const categorySlug = lead.product.category?.slug || '';
            const productSlug = lead.product.slug;
            const url = `${this.siteUrl}/catalog/${categorySlug}/${productSlug}`;
            productLink = `<a href="${url}">${lead.product.title}</a>`;
        }
        const pixel = lead.pixel && lead.pixel !== 'undefined' ? lead.pixel : '—';
        const text = `
📦 <b>Нове замовлення!</b>

👤 <b>Ім'я:</b> ${lead.name || 'Не вказано'}
📱 <b>Телефон:</b> ${lead.phone || 'Не вказано'}
💬 <b>Повідомлення:</b> ${lead.message || '—'}
🔗 <b>Товар:</b> ${productLink}
📍 <b>Джерело:</b> ${lead.source || '—'}
Pixel: ${pixel}
    `.trim();
        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                }),
            });
            if (!response.ok) {
                const error = await response.text();
                this.logger.error(`Telegram API error: ${error}`);
            }
        }
        catch (error) {
            this.logger.error('Failed to send Telegram notification', error);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map