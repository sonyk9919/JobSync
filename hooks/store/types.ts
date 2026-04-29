import { ParsedJob } from "@/utils/parser/types";

export interface JobCalendarModal {
    form: CalendarForm | null;
    initForm: (job: ParsedJob | null) => void;
    changeForm: <K extends keyof CalendarForm>(field: K, value: CalendarForm[K]) => void;
    changeReminder: (index: number, field: keyof Reminder, value: number | ReminderUnit) => void;
    addReminder: () => void;
    removeReminder: (index: number) => void;
}

export interface CalendarForm {
    title: string;
    date: string;
    reminders: Reminder[];
    memo: string;
}

export interface Reminder {
    value: number;
    unit: ReminderUnit;
}

export enum ReminderUnit {
    MINUTES = 'minutes',
    HOURS = 'hours',
    DAYS = 'days',
}