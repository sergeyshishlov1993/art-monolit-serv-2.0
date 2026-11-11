import { LeadsService } from './leads.service';

function build() {
    const created = { id: '1', name: 'Іван', phone: '+380501112233', message: null, source: 'product_page', pixel: null, utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'granit', product: null };
    const prisma = { lead: { create: jest.fn().mockResolvedValue(created) } };
    const telegram = { sendLeadNotification: jest.fn() };
    return { service: new LeadsService(prisma as never, telegram as never), prisma, telegram };
}

describe('LeadsService.create', () => {
    it('зберігає UTM і передає їх у Telegram', async () => {
        const { service, prisma, telegram } = build();
        await service.create({ name: 'Іван', phone: '+380501112233', utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'granit' });

        expect(prisma.lead.create.mock.calls[0][0].data).toMatchObject({ utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'granit' });
        expect(telegram.sendLeadNotification).toHaveBeenCalledWith(expect.objectContaining({ utmSource: 'google', utmCampaign: 'granit' }));
    });

    it('заповнений honeypot: нічого не зберігає і не шле в Telegram', async () => {
        const { service, prisma, telegram } = build();
        await service.create({ name: 'bot', phone: '+380501112233', website: 'http://spam' });

        expect(prisma.lead.create).not.toHaveBeenCalled();
        expect(telegram.sendLeadNotification).not.toHaveBeenCalled();
    });

    it('поле website не потрапляє в базу', async () => {
        const { service, prisma } = build();
        await service.create({ name: 'Іван', phone: '+380501112233', website: '' });

        expect(prisma.lead.create.mock.calls[0][0].data).not.toHaveProperty('website');
    });
});
