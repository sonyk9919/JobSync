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
