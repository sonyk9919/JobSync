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

    public static getDday(dueDate: Date | null): number | null {
        if (!dueDate) return null;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    public static getDdayLabel(dday: number | null): string {
        if (dday === null) return '상시채용';
        if (dday < 0) return '마감';
        return `D-${dday}`;
    }

    public static getDdayBadgeStyle(dday: number | null): string {
        if (dday === null) return 'bg-gray-50 text-gray-400';
        if (dday <= 7) return 'bg-red-50 text-red-800';
        if (dday <= 14) return 'bg-amber-50 text-amber-800';
        return 'bg-blue-50 text-blue-800';
    }

    public static getDdayTextStyle(dday: number | null): string {
        if (dday === null) return 'text-gray-400';
        if (dday <= 7) return 'text-red-500';
        if (dday <= 14) return 'text-amber-500';
        return 'text-blue-400';
    }

    public static toMinutes = (value: number, unit: ReminderUnit): number => {
        if (unit === ReminderUnit.MINUTES) return value;
        if (unit === ReminderUnit.HOURS) return value * 60;
        return value * 60 * 24;
    };
}

export default DateUtils;
