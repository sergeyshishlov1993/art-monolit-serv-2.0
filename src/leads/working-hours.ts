import type { Schedule } from '../site-settings/site-settings.service';

const TIME_ZONE = 'Europe/Kyiv';

// Чи входить момент у робочий час за графіком (час за Києвом)
export function isWorkingTime(schedule: Schedule, now: Date = new Date()): boolean {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(now);

    const part = (type: string): string => parts.find((item) => item.type === type)?.value ?? '';
    const weekday = part('weekday');
    const time = `${part('hour')}:${part('minute')}`;

    const day = weekday === 'Sat' ? schedule.saturday : weekday === 'Sun' ? schedule.sunday : schedule.weekdays;

    return Boolean(day) && time >= day!.from && time < day!.to;
}
