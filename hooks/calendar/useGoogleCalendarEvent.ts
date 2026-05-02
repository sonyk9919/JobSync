import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGoogleCalendarId from './useGoogleCalendarId';
import { toast } from 'sonner';
import CalendarAPI from '@/api/calendar';
import { CalendarForm, ReminderMethod } from '@/types/calendar';
import { ParsedJob } from '@/utils/parser/types';
import DateUtils from '@/utils/DateUtils';

const useGoogleCalendarEvent = () => {
    const queryClient = useQueryClient();
    const { calendarId, hasCalendar } = useGoogleCalendarId();
    const { data: events = [] } = useQuery({
        queryKey: ['CalendarEvents', calendarId],
        queryFn: async () => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            return await CalendarAPI.getEvents(calendarId);
        },
        enabled: hasCalendar,
    });
    const { mutateAsync: addEventMutate, isPending: isAddLoading } = useMutation({
        mutationFn: async ({ form, job }: { form: CalendarForm; job: ParsedJob }) => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            await CalendarAPI.addEvent(calendarId, {
                summary: form.title,
                start: { date: form.date },
                end: { date: form.date },
                description: form.memo,
                reminders: {
                    useDefault: false,
                    overrides: form.reminders.map((r) => ({
                        method: ReminderMethod.POPUP,
                        minutes: DateUtils.toMinutes(r.value, r.unit),
                    })),
                },
                extendedProperties: {
                    private: {
                        origin: JSON.stringify(job),
                    },
                },
            });
            return job;
        },
        onSuccess: (job) => {
            queryClient.setQueryData(['CalendarEvents', calendarId], [...events, job]);
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
                    const event = {
                        summary: `${job.company} - ${job.title}`,
                        start: { date },
                        end: { date },
                        description: job.url,
                        reminders: {
                            useDefault: false,
                            overrides: [{ method: ReminderMethod.POPUP, minutes: 60 * 24 }],
                        },
                        extendedProperties: {
                            private: {
                                origin: JSON.stringify(job),
                            },
                        },
                    };
                    await CalendarAPI.addEvent(calendarId, event);
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

            return succeeded;
        },
        onSuccess: (jobs) => {
            queryClient.setQueryData(['CalendarEvents', calendarId], [...events, ...jobs]);
        },
        onError: (e) => {
            toast.error(e instanceof Error ? e.message : '캘린더 추가 중 오류가 발생했어요.');
        },
    });

    return {
        events,
        addEvent: addEventMutate,
        isAddLoading,
        addEvents: addEventsMutate,
        isAddAllLoading,
    };
};

export default useGoogleCalendarEvent;
