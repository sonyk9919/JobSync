import Button from '@/components/common/Button';
import FormField from '@/components/common/FormField';
import useGoogleCalendarEvent from '@/hooks/calendar/useGoogleCalendarEvent';
import useJobCalendarModal from '@/hooks/store/useJobCalendarModal';
import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import { CalendarForm, ReminderUnit } from '@/types/calendar';
import DateUtils from '@/utils/DateUtils';
import { Loader2, Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';

const JobCalendarForm = () => {
    const { addEvent, isAddLoading } = useGoogleCalendarEvent();
    const { register: registerJob } = useRegisteredJobs();
    const reminderListRef = useRef<HTMLDivElement>(null);
    const { job, setJob } = useJobCalendarModal();

    const { register, handleSubmit, reset, control } = useForm<CalendarForm>({
        defaultValues: {
            title: '',
            date: '',
            reminders: [{ value: 1, unit: ReminderUnit.DAYS }],
            memo: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: 'reminders',
        control,
    });

    const date = useWatch({ control, name: 'date' });
    const reminders = useWatch({ control, name: 'reminders' });

    const handleAddReminder = () => {
        append({ value: 1, unit: ReminderUnit.DAYS });
        setTimeout(() => {
            if (!reminderListRef.current) return;
            reminderListRef.current.scrollTo({
                top: reminderListRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 0);
    };
    const onSubmit = async (form: CalendarForm) => {
        if (!job) return;
        const registeredJob = await addEvent({ form, job });
        registerJob(registeredJob.url);
        setJob(null);
    };

    useEffect(() => {
        if (!job) return;
        reset({
            title: `${job.company} - ${job.title}`,
            date:
                job.dueDate?.toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
            reminders: [{ value: 1, unit: ReminderUnit.DAYS }],
            memo: job.url,
        });
    }, [job, reset]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3">
                <FormField label="일정 제목">
                    <FormField.Input type="text" {...register('title')} />
                </FormField>
                <FormField label="마감일">
                    <FormField.Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date')}
                    />
                </FormField>
                <div className="flex flex-col gap-2">
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
                    <div
                        ref={reminderListRef}
                        className="flex flex-col gap-2 max-h-36 overflow-y-auto scrollbar-hide"
                    >
                        {fields.map((field, idx) => (
                            <div key={field.id} className="flex flex-col gap-1">
                                <div className="flex gap-2 items-center">
                                    <div className="text-xs text-gray-400 w-5 h-5 shrink-0 border border-gray-100 rounded-full flex items-center justify-center">
                                        {idx + 1}
                                    </div>
                                    <FormField.Input
                                        type="number"
                                        min={1}
                                        className="w-20"
                                        {...register(`reminders.${idx}.value`, {
                                            valueAsNumber: true,
                                        })}
                                    />
                                    <select
                                        className="bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900 flex-1"
                                        {...register(`reminders.${idx}.unit`)}
                                    >
                                        <option value={ReminderUnit.MINUTES}>분 전</option>
                                        <option value={ReminderUnit.HOURS}>시간 전</option>
                                        <option value={ReminderUnit.DAYS}>일 전</option>
                                    </select>
                                    {fields.length > 1 && (
                                        <button
                                            onClick={() => remove(idx)}
                                            className="text-gray-200 hover:text-red-600 duration-150"
                                        >
                                            <X className="size-4" />
                                        </button>
                                    )}
                                </div>
                                {date && reminders[idx] && (
                                    <span
                                        className={`text-xs pl-7 ${
                                            DateUtils.isPast(
                                                date,
                                                reminders[idx].value,
                                                reminders[idx].unit
                                            )
                                                ? 'text-red-400'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        {DateUtils.getAlertTime(
                                            date,
                                            reminders[idx].value,
                                            reminders[idx].unit
                                        )}
                                        에 알림
                                        {DateUtils.isPast(
                                            date,
                                            reminders[idx].value,
                                            reminders[idx].unit
                                        ) && ' · 이미 지난 시간이에요'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <FormField label="메모">
                    <FormField.Textarea rows={3} {...register('memo')} />
                </FormField>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <Button variant="secondary" onClick={() => setJob(null)}>
                    취소
                </Button>
                <Button variant="primary" disabled={isAddLoading} onClick={handleSubmit(onSubmit)}>
                    {isAddLoading ? <Loader2 className="size-4 animate-spin" /> : '추가'}
                </Button>
            </div>
        </div>
    );
};

export default JobCalendarForm;
