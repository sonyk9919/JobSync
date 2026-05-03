import CalendarAPI from '@/api/calendar';
import { CalendarEventWithId, CalendarForm, ReminderUnit } from '@/types/calendar';
import { ParsedJob } from '@/utils/parser/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import useGoogleCalendarId from '../useGoogleCalendarId';

const useGoogleCalendarEventMutate = () => {
    const queryClient = useQueryClient();
    const { calendarId, hasCalendar } = useGoogleCalendarId();
    const { mutateAsync: addEventMutate, isPending: isAddLoading } = useMutation({
        mutationFn: async ({ form, job }: { form: CalendarForm; job: ParsedJob }) => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            return await CalendarAPI.addEvent(calendarId, form, job);
        },
        onSuccess: (event: CalendarEventWithId<ParsedJob>) => {
            queryClient.setQueryData(
                ['CalendarEvents', calendarId],
                (prev?: CalendarEventWithId<ParsedJob>[]) => [...(prev || []), event]
            );
            toast.success('캘린더에 추가됐어요.');
        },
        onError: (e) => {
            toast.error(e instanceof Error ? e.message : '캘린더 추가 중 오류가 발생했어요.');
        },
    });
    const { mutateAsync: addEventsMutate, isPending: isAddAllLoading } = useMutation({
        mutationFn: async (jobs: ParsedJob[]) => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            const openJobs = jobs.filter((j) => !j.dueDate);
            const closedJobs = jobs.filter((j) => j.dueDate);

            if (openJobs.length > 0) {
                toast.info(`상시 공고 제외: ${openJobs.map((j) => j.company).join(', ')}`);
            }
            if (closedJobs.length === 0) {
                toast.info('추가할 공고가 없어요. (전부 상시 공고)');
                return [];
            }

            const results = await Promise.allSettled(
                closedJobs.map(async (job) => {
                    const date = job.dueDate!.toISOString().split('T')[0];
                    const form: CalendarForm = {
                        title: job.title,
                        date,
                        memo: job.url,
                        reminders: [{ value: 1, unit: ReminderUnit.DAYS }],
                    };
                    return await CalendarAPI.addEvent(calendarId, form, job);
                })
            );

            const succeeded = closedJobs.filter((_, idx) => results[idx].status === 'fulfilled');
            const failed = closedJobs.filter((_, idx) => results[idx].status === 'rejected');

            if (succeeded.length > 0) {
                toast.success(`${succeeded.length}개 공고가 캘린더에 추가됐어요.`);
            }
            if (failed.length > 0) {
                const names = failed.map((j) => j.company).join(', ');
                const truncated = names.length > 30 ? names.slice(0, 30) + '...' : names;
                toast.error(`${truncated} 공고를 추가하지 못했어요.`);
            }

            return results
                .filter((result) => result.status === 'fulfilled')
                .map((result) => result.value);
        },
        onSuccess: (events: CalendarEventWithId<ParsedJob>[]) => {
            queryClient.setQueryData(
                ['CalendarEvents', calendarId],
                (prev?: CalendarEventWithId<ParsedJob>[]) => [...(prev || []), ...events]
            );
        },
        onError: (e) => {
            toast.error(e instanceof Error ? e.message : '캘린더 추가 중 오류가 발생했어요.');
        },
    });
    const { mutateAsync: updateEventMutate, isPending: isUpdateLoading } = useMutation({
        mutationFn: async ({
            form,
            event,
        }: {
            form: CalendarForm;
            event: CalendarEventWithId<ParsedJob>;
        }) => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            return await CalendarAPI.updateEvent(calendarId, form, event);
        },
        onSuccess: (event) => {
            queryClient.setQueryData(
                ['CalendarEvents', calendarId],
                (prev?: CalendarEventWithId[]) =>
                    (prev || []).map((e) => (e.id === event.id ? event : e))
            );
            toast.success('캘린더 일정이 수정됐어요.');
        },
        onError: (e) => {
            toast.error(e instanceof Error ? e.message : '캘린더 수정 중 오류가 발생했어요.');
        },
    });

    const { mutateAsync: deleteEventMutate, isPending: isDeleteLoading } = useMutation({
        mutationFn: async (event: CalendarEventWithId<ParsedJob>) => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            await CalendarAPI.deleteEvent(calendarId, event.id);
            return event;
        },
        onSuccess: (event) => {
            queryClient.setQueryData(
                ['CalendarEvents', calendarId],
                (prev?: CalendarEventWithId<ParsedJob>[]) =>
                    (prev || []).filter((e) => e.id !== event.id)
            );
            toast.success('캘린더 일정이 삭제됐어요.');
        },
        onError: (e) => {
            toast.error(e instanceof Error ? e.message : '캘린더 삭제 중 오류가 발생했어요.');
        },
    });

    return {
        addEvent: addEventMutate,
        isAddLoading,
        addEvents: addEventsMutate,
        isAddAllLoading,
        updateEvent: updateEventMutate,
        isUpdateLoading,
        deleteEvent: deleteEventMutate,
        isDeleteLoading,
    };
};

export default useGoogleCalendarEventMutate;
