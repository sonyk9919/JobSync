import { CalendarEventWithId, ReminderUnit } from '@/types/calendar';
import { ParsedJob } from './parser/types';

class DateUtils {
    public static DAY_HEADERS = ['일', '월', '화', '수', '목', '금', '토'];

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

    public static fromMinutes = (minutes: number): { value: number; unit: ReminderUnit } => {
        if (minutes % (60 * 24) === 0)
            return { value: minutes / (60 * 24), unit: ReminderUnit.DAYS };
        if (minutes % 60 === 0) return { value: minutes / 60, unit: ReminderUnit.HOURS };
        return { value: minutes, unit: ReminderUnit.MINUTES };
    };

    public static toMinutes = (value: number, unit: ReminderUnit): number => {
        if (unit === ReminderUnit.MINUTES) return value;
        if (unit === ReminderUnit.HOURS) return value * 60;
        return value * 60 * 24;
    };

    public static groupByDday(events: CalendarEventWithId<ParsedJob>[]) {
        const d3: CalendarEventWithId<ParsedJob>[] = [];
        const d7: CalendarEventWithId<ParsedJob>[] = [];
        const d10: CalendarEventWithId<ParsedJob>[] = [];
        const later: CalendarEventWithId<ParsedJob>[] = [];

        events.forEach((event) => {
            const dday = this.getDday(new Date(event.end.date));
            if (dday === null) return;
            if (dday <= 3) d3.push(event);
            else if (dday <= 7) d7.push(event);
            else if (dday <= 10) d10.push(event);
            else later.push(event);
        });

        const sortByDday = (a: CalendarEventWithId<ParsedJob>, b: CalendarEventWithId<ParsedJob>) =>
            new Date(a.end.date).getTime() - new Date(b.end.date).getTime();

        return {
            d3: d3.sort(sortByDday),
            d7: d7.sort(sortByDday),
            d10: d10.sort(sortByDday),
            later: later.sort(sortByDday),
        };
    }

    public static getCalendarCells(date: Date): (Date | null)[] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const cells: (Date | null)[] = Array(firstDay).fill(null);
        for (let d = 1; d <= lastDate; d++) {
            cells.push(new Date(year, month, d));
        }
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }
}

export default DateUtils;
