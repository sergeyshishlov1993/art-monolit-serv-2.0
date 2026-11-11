import { isWorkingTime } from './working-hours';

const schedule = {
    weekdays: { from: '09:00', to: '18:00' },
    saturday: { from: '10:00', to: '15:00' },
    sunday: null,
};

describe('isWorkingTime', () => {
    it('понеділок 12:00 за Києвом — робочий час', () => {
        expect(isWorkingTime(schedule, new Date('2026-11-09T10:00:00Z'))).toBe(true);
    });

    it('понеділок 18:00 і пізніше — ні (кінець не включається)', () => {
        expect(isWorkingTime(schedule, new Date('2026-11-09T16:00:00Z'))).toBe(false);
    });

    it('субота 09:30 — ще не відкрито, 10:30 — відкрито', () => {
        expect(isWorkingTime(schedule, new Date('2026-11-14T07:30:00Z'))).toBe(false);
        expect(isWorkingTime(schedule, new Date('2026-11-14T08:30:00Z'))).toBe(true);
    });

    it('неділя — вихідний', () => {
        expect(isWorkingTime(schedule, new Date('2026-11-15T10:00:00Z'))).toBe(false);
    });
});
