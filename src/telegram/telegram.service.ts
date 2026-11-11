import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface LeadNotification {
    name: string;
    phone: string;
    message?: string | null;
    source?: string | null;
    pixel?: string | null;
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    product?: {
        title: string;
        slug: string;
        category?: { slug: string } | null;
    } | null;
}

const escapeHtml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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
            productLink = `<a href="${url}">${escapeHtml(lead.product.title)}</a>`;
        }

        const utm = [lead.utmSource, lead.utmMedium, lead.utmCampaign]
            .filter((part): part is string => Boolean(part))
            .map(escapeHtml)
            .join(' / ');

        const pixel = lead.pixel && lead.pixel !== 'undefined' ? escapeHtml(lead.pixel) : '—';

        const text = `
📦 <b>Нове замовлення!</b>

👤 <b>Ім'я:</b> ${escapeHtml(lead.name || 'Не вказано')}
📱 <b>Телефон:</b> ${escapeHtml(lead.phone || 'Не вказано')}
💬 <b>Повідомлення:</b> ${lead.message ? escapeHtml(lead.message) : '—'}
🔗 <b>Товар:</b> ${productLink}
📍 <b>Джерело:</b> ${lead.source ? escapeHtml(lead.source) : '—'}
Pixel: ${pixel}${utm ? `\n🎯 <b>Реклама:</b> ${utm}` : ''}
    `.trim();

        await this.send(text);
    }

    // Повертає true, лише якщо Telegram прийняв повідомлення
    async sendOverdueLeadsReminder(leads: { number: number; name: string; phone: string; createdAt: Date }[]): Promise<boolean> {
        const lines = leads.map((lead) => {
            const minutes = Math.round((Date.now() - lead.createdAt.getTime()) / 60000);
            return `№${lead.number} · ${escapeHtml(lead.name)} · ${escapeHtml(lead.phone)} · ${minutes} хв тому`;
        });

        return this.send(`⏰ <b>Необроблені заявки (понад 30 хв)</b>\n\n${lines.join('\n')}`);
    }

    private async send(text: string): Promise<boolean> {
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
                return false;
            }

            return true;
        } catch (error) {
            this.logger.error('Failed to send Telegram notification', error);
            return false;
        }
    }
}