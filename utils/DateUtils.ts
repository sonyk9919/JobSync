import { ReminderUnit } from '@/types/calendar';

class DateUtils {
    private static getAlertDate(date: string, value: number, unit: ReminderUnit): Date {
        const base = new Date(date);
        base.setHours(0, 0, 0, 0);
        if (unit === ReminderUnit.DAYS) base.setDate(base.getDate() - value);
        if (unit === ReminderUnit.HOURS) base.setHours(base.getHours() - value);
        if (unit === ReminderUnit.MINUTES) base.setMinutes(base.getMinutes() - value);
        return base;
    }

    public static getAlertTime(date: string, value: number, unit: ReminderUnit): string {
        return this.getAlertDate(date, value, unit).toLocaleString('ko-KR', {
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    public static isPast(date: string, value: number, unit: ReminderUnit): boolean {
        return this.getAlertDate(date, value, unit) < new Date();
    }
}

export default DateUtils;
