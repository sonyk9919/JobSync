import {
    CalendarCreateBody,
    CalendarCreateSchema,
    CalendarForm,
    CalendarListSchema,
    EventBody,
    EventCreateSchema,
    ReminderMethod,
    ReminderUnit,
} from '@/types/calendar';
import useAccessToken from '../store/useAccessToken';
import { toast } from 'sonner';
import { ParsedJob } from '@/utils/parser/types';

const CALENDAR_NAME = 'JobSync';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

const useGoogleCalendar = () => {
    const { accessToken } = useAccessToken();

    const getHeaders = () => ({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    });

    const getOrCreateCalendar = async (): Promise<string> => {
        const listRes = await fetch(`${CALENDAR_API}/users/me/calendarList`, {
            headers: getHeaders(),
        });
        if (!listRes.ok) throw new Error(`캘린더 목록 조회 실패 (${listRes.status})`);

        const data = CalendarListSchema.parse(await listRes.json());
        const existing = data.items?.find((c) => c.summary === CALENDAR_NAME);
        if (existing) return existing.id;

        const body: CalendarCreateBody = { summary: CALENDAR_NAME };
        const createRes = await fetch(`${CALENDAR_API}/calendars`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!createRes.ok) throw new Error(`캘린더 생성 실패 (${createRes.status})`);

        const calendar = CalendarCreateSchema.parse(await createRes.json());
        return calendar.id;
    };

    const toMinutes = (value: number, unit: ReminderUnit): number => {
        if (unit === ReminderUnit.MINUTES) return value;
        if (unit === ReminderUnit.HOURS) return value * 60;
        return value * 60 * 24;
    };

    const buildEventBody = (
        summary: string,
        date: string,
        description: string,
        overrides: { method: ReminderMethod; minutes: number }[]
    ): EventBody => ({
        summary,
        start: { date },
        end: { date },
        description,
        reminders: {
            useDefault: false,
            overrides,
        },
    });

    const addEvent = async (form: CalendarForm): Promise<void> => {
        try {
            const calendarId = await getOrCreateCalendar();
            const body = buildEventBody(
                form.title,
                form.date,
                form.memo,
                form.reminders.map((r) => ({
                    method: ReminderMethod.POPUP,
                    minutes: toMinutes(r.value, r.unit),
                }))
            );

            const eventRes = await fetch(
                `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
                {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify(body),
                }
            );
            if (!eventRes.ok) throw new Error(`이벤트 추가 실패 (${eventRes.status})`);

            EventCreateSchema.parse(await eventRes.json());
            toast.success('캘린더에 추가됐어요.');
        } catch (err) {
            toast.error(err instanceof Error ? err.message : '캘린더 추가 중 오류가 발생했어요.');
        }
    };

    const addEvents = async (jobs: ParsedJob[]): Promise<string[]> => {
        const openJobs = jobs.filter((j) => !j.dueDate);
        const closedJobs = jobs.filter((j) => j.dueDate);

        if (openJobs.length > 0) {
            toast.info(`상시 공고 제외: ${openJobs.map((j) => j.company).join(', ')}`);
        }
        if (closedJobs.length === 0) {
            toast.info('추가할 공고가 없어요. (전부 상시 공고)');
            return [];
        }

        try {
            const calendarId = await getOrCreateCalendar();
            const results = await Promise.allSettled(
                closedJobs.map(async (job) => {
                    const date = job.dueDate!.toISOString().split('T')[0];
                    const body = buildEventBody(`${job.company} - ${job.title}`, date, job.url, [
                        { method: ReminderMethod.POPUP, minutes: 60 * 24 },
                    ]);

                    const res = await fetch(
                        `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
                        {
                            method: 'POST',
                            headers: getHeaders(),
                            body: JSON.stringify(body),
                        }
                    );
                    if (!res.ok)
                        throw new Error(`캘린더 추가 중 오류가 발생했어요. (${res.status})`);
                    EventCreateSchema.parse(await res.json());
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

            return succeeded.map((j) => j.url);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : '캘린더 추가 중 오류가 발생했어요.');
            return [];
        }
    };

    return { addEvent, addEvents };
};

export default useGoogleCalendar;
