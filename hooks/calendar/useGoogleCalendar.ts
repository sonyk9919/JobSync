import { CalendarForm, ReminderUnit } from '@/types/calendar';
import useAccessToken from '../store/useAccessToken';
import { toast } from 'sonner';
import { ParsedJob } from '@/utils/parser/types';

const CALENDAR_NAME = 'JobSync';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

const useGoogleCalendar = () => {
    const { accessToken, isLoggedIn } = useAccessToken();

    const getHeaders = () => ({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    });

    const getOrCreateCalendar = async (): Promise<string> => {
        const response = await fetch(`${CALENDAR_API}/users/me/calendarList`, {
            headers: getHeaders(),
        });
        const data = await response.json();

        const existing = data.items?.find(
            (c: { summary: string; id: string }) => c.summary === CALENDAR_NAME
        );
        if (existing) return existing.id;

        const created = await fetch(`${CALENDAR_API}/calendars`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ summary: CALENDAR_NAME }),
        });
        const calendar = await created.json();
        return calendar.id;
    };

    const toMinutes = (value: number, unit: ReminderUnit): number => {
        if (unit === ReminderUnit.MINUTES) return value;
        if (unit === ReminderUnit.HOURS) return value * 60;
        return value * 60 * 24;
    };

    const addEvent = async (form: CalendarForm): Promise<void> => {
        if (!isLoggedIn()) {
            toast.error('로그인이 필요해요.');
            return;
        }

        try {
            const calendarId = await getOrCreateCalendar();
            await fetch(`${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({
                    summary: form.title,
                    start: { date: form.date },
                    end: { date: form.date },
                    description: form.memo,
                    reminders: {
                        useDefault: false,
                        overrides: form.reminders.map((r) => ({
                            method: 'popup',
                            minutes: toMinutes(r.value, r.unit),
                        })),
                    },
                }),
            });
            toast.success('캘린더에 추가됐어요.');
        } catch {
            toast.error('캘린더 추가 중 오류가 발생했어요.');
        }
    };

    const addEvents = async (jobs: ParsedJob[]): Promise<string[]> => {
        if (!isLoggedIn()) {
            toast.error('로그인이 필요해요.');
            return [];
        }

        try {
            const calendarId = await getOrCreateCalendar();

            const openJobs = jobs.filter((j) => !j.dueDate);
            const closedJobs = jobs.filter((j) => j.dueDate);

            if (openJobs.length > 0) {
                toast.info(`상시 공고 제외: ${openJobs.map((j) => j.company).join(', ')}`);
            }

            const results = await Promise.allSettled(
                closedJobs.map((job) =>
                    fetch(`${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`, {
                        method: 'POST',
                        headers: getHeaders(),
                        body: JSON.stringify({
                            summary: `${job.company} - ${job.title}`,
                            start: { date: job.dueDate!.toISOString().split('T')[0] },
                            end: { date: job.dueDate!.toISOString().split('T')[0] },
                            description: job.url,
                            reminders: {
                                useDefault: false,
                                overrides: [{ method: 'popup', minutes: 60 * 24 }],
                            },
                        }),
                    })
                )
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

            return succeeded.map((j) => j.url);
        } catch {
            toast.error('캘린더 추가 중 오류가 발생했어요.');
            return [];
        }
    };

    return { addEvent, addEvents };
};

export default useGoogleCalendar;
