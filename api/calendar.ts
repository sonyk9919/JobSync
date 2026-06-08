import {
    CalendarCreate,
    CalendarCreateBody,
    CalendarEventResponse,
    CalendarEventWithId,
    CalendarForm,
    CalendarList,
    ReminderMethod,
} from '@/types/calendar';
import calendarAxios from './calendar-axios';
import { CALENDAR_NAME } from '@/hooks/calendar/useGoogleCalendarId';
import { ParsedJob, ParsedJobSchema } from '@/utils/parser/types';
import DateUtils from '@/utils/DateUtils';

const buildEvent = (form: CalendarForm, job: ParsedJob) => ({
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

const CalendarAPI = {
    getCalendarId: async () => {
        const result = await calendarAxios.get<CalendarList>('/users/me/calendarList');
        const exisiting = result.data.items?.find((calendar) => calendar.summary === CALENDAR_NAME);
        return exisiting?.id ?? null;
    },
    createCalendar: async (body: CalendarCreateBody) => {
        const result = await calendarAxios.post<CalendarCreate>('/calendars', body);
        return result.data.id;
    },
    addEvent: async (calendarId: string, form: CalendarForm, job: ParsedJob) => {
        const result = await calendarAxios.post<CalendarEventWithId>(
            `/calendars/${encodeURIComponent(calendarId)}/events`,
            buildEvent(form, job)
        );
        return {
            ...result.data,
            extendedProperties: {
                private: {
                    origin: ParsedJobSchema.parse(
                        JSON.parse(result.data.extendedProperties.private.origin)
                    ),
                },
            },
        };
    },
    deleteEvent: async (calendarId: string, eventId: string) => {
        await calendarAxios.delete(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`
        );
    },
    updateEvent: async (
        calendarId: string,
        form: CalendarForm,
        event: CalendarEventWithId<ParsedJob>
    ) => {
        const result = await calendarAxios.patch<CalendarEventWithId>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(event.id)}`,
            buildEvent(form, event.extendedProperties.private.origin)
        );
        return {
            ...result.data,
            extendedProperties: {
                private: {
                    origin: ParsedJobSchema.parse(
                        JSON.parse(result.data.extendedProperties.private.origin)
                    ),
                },
            },
        };
    },
    getEvents: async (calendarId: string) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const result = await calendarAxios.get<CalendarEventResponse>(
            `/calendars/${encodeURIComponent(calendarId)}/events`,
            {
                params: {
                    maxResults: 2500,
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: oneMonthAgo.toISOString(),
                },
            }
        );
        return (result.data.items || [])
            .map((event) => {
                if (!event.extendedProperties.private) {
                    console.error(`${event.summary} 일정은 원본 정보가 없습니다.`);
                    return null;
                }
                try {
                    return {
                        ...event,
                        extendedProperties: {
                            private: {
                                origin: ParsedJobSchema.parse(
                                    JSON.parse(event.extendedProperties.private.origin)
                                ),
                            },
                        },
                    };
                } catch (e) {
                    console.error('타입 검증에 실패했습니다.', event.summary, e);
                    return null;
                }
            })
            .filter((event): event is CalendarEventWithId<ParsedJob> => event != null);
    },
};

export default CalendarAPI;
