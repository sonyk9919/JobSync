import z from 'zod';

export interface CalendarForm {
    title: string;
    date: string;
    reminders: { value: number; unit: ReminderUnit }[];
    memo: string;
}

export enum ReminderUnit {
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
}

export interface CalendarCreateBody {
    summary: string;
}

export interface CalendarEvent {
    summary: string;
    start: { date: string };
    end: { date: string };
    description: string;
    reminders: {
        useDefault: boolean;
        overrides: { method: ReminderMethod; minutes: number }[];
    };
    extendedProperties?: {
        private: Record<string, string>;
    };
}

export const enum ReminderMethod {
    POPUP = 'popup',
    EMAIL = 'email',
}

export const CalendarItemSchema = z.object({
    id: z.string(),
    summary: z.string(),
});

export const CalendarListSchema = z.object({
    items: z.array(CalendarItemSchema).optional(),
});

export const CalendarCreateSchema = z.object({
    id: z.string(),
    summary: z.string(),
});

export const EventCreateSchema = z.object({
    id: z.string(),
    summary: z.string(),
    htmlLink: z.string().optional(),
});

export type CalendarItem = z.infer<typeof CalendarItemSchema>;
export type CalendarList = z.infer<typeof CalendarListSchema>;
export type CalendarCreate = z.infer<typeof CalendarCreateSchema>;
