import { ReminderUnit } from "@/hooks/store/types";
import useJobCalendarModal from "@/hooks/store/useJobCalendarModal";
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useRef } from "react";

const JobCalendarModal = () => {
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
        <Dialog open={form !== null}>
            <DialogPortal>
                <DialogOverlay
                    onClick={() => initForm(null)}
                    className="fixed inset-0 bg-black/40"
                />
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 flex flex-col gap-4">
                    <DialogTitle className="text-base font-medium text-gray-900">
                        구글 캘린더에 추가
                    </DialogTitle>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">일정 제목</label>
                            <input
                                type="text"
                                value={form?.title ?? ''}
                                onChange={e => changeForm('title', e.target.value)}
                                className=" bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">마감일</label>
                            <input
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                                value={form?.date}
                                onChange={e => changeForm('date', e.target.value)}
                                className="bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900"
                            />
                        </div>
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
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-gray-400">메모</label>
                            <textarea
                                value={form?.memo ?? ''}
                                onChange={e => changeForm('memo', e.target.value)}
                                rows={3}
                                className="bg-gray-100 text-sm border border-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 text-gray-900 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => initForm(null)}
                            className="text-sm px-4 py-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50 duration-150"
                        >
                            취소
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="text-sm px-4 py-2 rounded-lg bg-blue-400 text-white hover:bg-blue-600 duration-150"
                        >
                            추가
                        </button>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default JobCalendarModal;