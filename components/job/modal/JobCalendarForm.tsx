import Button from "@/components/common/Button";
import FormField from "@/components/common/FormField";
import { ReminderUnit } from "@/hooks/store/types";
import useJobCalendarModal from "@/hooks/store/useJobCalendarModal";
import { Plus, X } from "lucide-react";
import { useRef } from "react";

const JobCalendarForm = () => {
    const { form, initForm, changeForm, changeReminder, addReminder, removeReminder } = useJobCalendarModal();
    const reminderListRef = useRef<HTMLDivElement>(null);

    const handleAddReminder = () => {
        addReminder();
        setTimeout(() => {
            if (!reminderListRef.current) return;
            reminderListRef.current.scrollTo({ 
                top: reminderListRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 0);
    };

    const handleSubmit = () => {
        console.log(form);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
                <FormField label="일정 제목">
                    <FormField.Input 
                        type="text"
                        value={form?.title ?? ''}
                        onChange={e => changeForm('title', e.target.value)}
                    />
                </FormField>
                <FormField label="마감일">
                    <FormField.Input 
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={form?.date}
                        onChange={e => changeForm('date', e.target.value)}
                    />
                </FormField>
                <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">알림</label>
                    <button
                        onClick={handleAddReminder}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-600 duration-150"
                    >
                        <Plus className="size-3" />
                        추가
                    </button>
                </div>
                <div ref={reminderListRef} className="flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-hide">
                    {form?.reminders.map((reminder, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <div className="text-xs text-gray-400 w-5 h-5 shrink-0 border border-gray-100 rounded-full flex items-center justify-center">{idx + 1}</div>
                            <input
                                type="number"
                                min={1}
                                value={reminder.value}
                                onChange={e => changeReminder(idx, 'value', Number(e.target.value))}
                                className="bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900 w-20"
                            />
                            <select
                                value={reminder.unit}
                                onChange={e => changeReminder(idx, 'unit', e.target.value as ReminderUnit)}
                                className="bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900 flex-1"
                            >
                                <option value={ReminderUnit.MINUTES}>분 전</option>
                                <option value={ReminderUnit.HOURS}>시간 전</option>
                                <option value={ReminderUnit.DAYS}>일 전</option>
                            </select>
                            {form.reminders.length > 1 && (
                                <button
                                    onClick={() => removeReminder(idx)}
                                    className="text-gray-200 hover:text-red-600 duration-150"
                                >
                                    <X className="size-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <FormField label="메모">
                    <FormField.Textarea 
                        value={form?.memo ?? ''}
                        onChange={e => changeForm('memo', e.target.value)}
                        rows={3}
                    />
                </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant='secondary' onClick={() => initForm(null)}>취소</Button>
                <Button variant="primary" onClick={handleSubmit}>추가</Button>
            </div>
        </div>
    )
};

export default JobCalendarForm;