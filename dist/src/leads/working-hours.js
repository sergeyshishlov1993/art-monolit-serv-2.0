"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWorkingTime = isWorkingTime;
const TIME_ZONE = 'Europe/Kyiv';
function isWorkingTime(schedule, now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: TIME_ZONE,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    }).formatToParts(now);
    const part = (type) => parts.find((item) => item.type === type)?.value ?? '';
    const weekday = part('weekday');
    const time = `${part('hour')}:${part('minute')}`;
    const day = weekday === 'Sat' ? schedule.saturday : weekday === 'Sun' ? schedule.sunday : schedule.weekdays;
    return Boolean(day) && time >= day.from && time < day.to;
}
//# sourceMappingURL=working-hours.js.map