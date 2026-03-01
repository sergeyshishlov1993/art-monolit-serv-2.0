import { Injectable, Logger } from '@nestjs/common';
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
        category?: { slug: string } | null;
    } | null;
}

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private readonly botToken: string;
    private readonly chatId: string;
    private readonly siteUrl = 'https://www.art-monolit.com.ua';

    constructor(private configService: ConfigService) {
        this.botToken = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
        this.chatId = this.configService.getOrThrow<string>('TELEGRAM_CHAT_ID');
    }

    async sendLeadNotification(lead: LeadNotification): Promise<void> {
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
        } catch (error) {
            this.logger.error('Failed to send Telegram notification', error);
        }
    }
}