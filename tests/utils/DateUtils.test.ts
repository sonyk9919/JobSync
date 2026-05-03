import { describe, it, expect, vi, beforeEach } from 'vitest';
import DateUtils from '@/utils/DateUtils';
import { ReminderUnit } from '@/types/calendar';

describe('DateUtils', () => {
    describe('getDday', () => {
        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2026-05-03T12:00:00'));
        });

        it('due date가 null이면 null 반환', () => {
            expect(DateUtils.getDday(null)).toBeNull();
        });

        it('오늘 마감이면 D-0', () => {
            expect(DateUtils.getDday(new Date(2026, 4, 3))).toBe(0);
        });

        it('내일 마감이면 D-1', () => {
            expect(DateUtils.getDday(new Date(2026, 4, 4))).toBe(1);
        });

        it('어제 마감이면 음수 반환', () => {
            expect(DateUtils.getDday(new Date(2026, 4, 2))).toBe(-1);
        });
    });

    describe('getDdayLabel', () => {
        it('null이면 상시채용', () => {
            expect(DateUtils.getDdayLabel(null)).toBe('상시채용');
        });

        it('음수면 마감', () => {
            expect(DateUtils.getDdayLabel(-1)).toBe('마감');
        });

        it('양수면 D-숫자', () => {
            expect(DateUtils.getDdayLabel(5)).toBe('D-5');
            expect(DateUtils.getDdayLabel(0)).toBe('D-0');
        });
    });

    describe('getDdayBadgeStyle', () => {
        it('null이면 gray', () => {
            expect(DateUtils.getDdayBadgeStyle(null)).toContain('gray');
        });

        it('7일 이하면 red', () => {
            expect(DateUtils.getDdayBadgeStyle(7)).toContain('red');
            expect(DateUtils.getDdayBadgeStyle(0)).toContain('red');
        });

        it('14일 이하면 amber', () => {
            expect(DateUtils.getDdayBadgeStyle(8)).toContain('amber');
            expect(DateUtils.getDdayBadgeStyle(14)).toContain('amber');
        });

        it('15일 이상이면 blue', () => {
            expect(DateUtils.getDdayBadgeStyle(15)).toContain('blue');
        });
    });

    describe('toMinutes', () => {
        it('MINUTES 단위 변환', () => {
            expect(DateUtils.toMinutes(30, ReminderUnit.MINUTES)).toBe(30);
        });

        it('HOURS 단위 변환', () => {
            expect(DateUtils.toMinutes(2, ReminderUnit.HOURS)).toBe(120);
        });

        it('DAYS 단위 변환', () => {
            expect(DateUtils.toMinutes(1, ReminderUnit.DAYS)).toBe(1440);
        });
    });

    describe('getCalendarCells', () => {
        it('2026년 5월 셀 수는 7의 배수', () => {
            const cells = DateUtils.getCalendarCells(new Date('2026-05-01'));
            expect(cells.length % 7).toBe(0);
        });

        it('2026년 5월 날짜 수는 31개', () => {
            const cells = DateUtils.getCalendarCells(new Date('2026-05-01'));
            expect(cells.filter(Boolean).length).toBe(31);
        });
    });
});
