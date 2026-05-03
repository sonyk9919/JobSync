import { ReminderUnit } from '@/types/calendar';
import { ParsedJob } from './parser/types';

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

    public static groupByDday(jobs: ParsedJob[]) {
        const d3: ParsedJob[] = [];
        const d7: ParsedJob[] = [];
        const d10: ParsedJob[] = [];
        const later: ParsedJob[] = [];

        jobs.forEach((job) => {
            const dueDate = job.dueDate ?? new Date();
            const dday = DateUtils.getDday(dueDate);

            if (dday === null) {
                later.push(job);
                return;
            }
            if (dday <= 3) d3.push(job);
            else if (dday <= 7) d7.push(job);
            else if (dday <= 10) d10.push(job);
            else later.push(job);
        });

        return { d3, d7, d10, later };
    }
}

export default DateUtils;
