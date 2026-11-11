import { LeadReminderService } from './lead-reminder.service';

const schedule = {
    weekdays: { from: '09:00', to: '18:00' },
    saturday: null,
    sunday: null,
};

const WORKING = new Date('2026-11-09T10:00:00Z'); // понеділок 12:00 за Києвом
const NIGHT = new Date('2026-11-09T22:00:00Z');

function build(sendResult = true) {
    const leads = [{ id: 'a', number: 1, name: 'Іван', phone: '+380501112233', createdAt: new Date(WORKING.getTime() - 3600_000) }];
    const prisma = {
        lead: {
            findMany: jest.fn().mockResolvedValue(leads),
            updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
    };
    const telegram = { sendOverdueLeadsReminder: jest.fn().mockResolvedValue(sendResult) };
    const settings = { get: jest.fn().mockResolvedValue({ schedule }) };
    const service = new LeadReminderService(prisma as never, telegram as never, settings as never, { get: jest.fn() } as never);
    return { service, prisma, telegram };
}

describe('LeadReminderService.check', () => {
    it('нічого не робить поза робочим часом', async () => {
        const { service, prisma, telegram } = build();
        expect(await service.check(NIGHT)).toBe(0);
        expect(prisma.lead.findMany).not.toHaveBeenCalled();
        expect(telegram.sendOverdueLeadsReminder).not.toHaveBeenCalled();
    });

    it('шле нагадування і позначає заявки як нагадані', async () => {
        const { service, prisma, telegram } = build();
        expect(await service.check(WORKING)).toBe(1);
        expect(prisma.lead.findMany.mock.calls[0][0].where).toMatchObject({ status: 'NEW', reminderSentAt: null });
        expect(telegram.sendOverdueLeadsReminder).toHaveBeenCalledTimes(1);
        expect(prisma.lead.updateMany).toHaveBeenCalledWith({ where: { id: { in: ['a'] } }, data: { reminderSentAt: WORKING } });
    });

    it('не позначає заявки, якщо Telegram не прийняв повідомлення', async () => {
        const { service, prisma } = build(false);
        expect(await service.check(WORKING)).toBe(0);
        expect(prisma.lead.updateMany).not.toHaveBeenCalled();
    });
});
