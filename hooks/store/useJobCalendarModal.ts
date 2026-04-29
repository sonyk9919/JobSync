// useJobCalendarModal.ts
import { create } from "zustand";
import { CalendarForm, JobCalendarModal, ReminderUnit } from "./types";

const useJobCalendarModal = create<JobCalendarModal>((set, get) => ({
    form: null,
    changeForm: (field, value) => {
        const { form } = get();
        if (!form) return;
        set({ form: { ...form, [field]: value } });
    },
    changeReminder: (index, field, value) => {
        const { form } = get();
        if (!form) return;
        const reminders = form.reminders.map((r, i) =>
            i === index ? { ...r, [field]: value } : r
        );
        set({ form: { ...form, reminders } });
    },
    initForm: job => {
        if (!job) {
            set({ form: null });
            return;
        }
        const form: CalendarForm = {
            title: `${job.company} - ${job.title}`,
            date: job.dueDate ? job.dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            reminders: [{ value: 1, unit: ReminderUnit.DAYS }],
            memo: job.url,
        };
        set({ form });
    },
    addReminder: () => {
        const { form } = get();
        if (!form) return;
        set({ form: { ...form, reminders: [...form.reminders, { value: 1, unit: ReminderUnit.DAYS }] } });
    },
    removeReminder: (index) => {
        const { form } = get();
        if (!form) return;
        set({ form: { ...form, reminders: form.reminders.filter((_, i) => i !== index) } });
    },
}));

export default useJobCalendarModal;