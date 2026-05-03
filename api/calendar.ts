import {
    CalendarCreate,
    CalendarCreateBody,
    CalendarEvent,
    CalendarEventResponse,
    CalendarList,
} from '@/types/calendar';
import calendarAxios from './calendar-axios';
import { CALENDAR_NAME } from '@/hooks/calendar/useGoogleCalendarId';
import { ParsedJob, ParsedJobSchema } from '@/utils/parser/types';

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
    addEvent: async (calendarId: string, event: CalendarEvent) => {
        await calendarAxios.post(`/calendars/${encodeURIComponent(calendarId)}/events`, event);
    },
    getEvents: async (calendarId: string) => {
        const now = new Date().toISOString();
        const result = await calendarAxios.get<CalendarEventResponse>(
            `/calendars/${encodeURIComponent(calendarId)}/events`,
            {
                params: {
                    maxResults: 2500,
                    singleEvents: true,
                    orderBy: 'startTime',
                    timeMin: now,
                },
            }
        );
        return (result.data.items || [])
            .map((event) => {
                if (!event.extendedProperties?.private) {
                    console.error(`${event.summary} 일정은 원본 정보가 없습니다.`);
                    return null;
                }
                try {
                    return ParsedJobSchema.parse(
                        JSON.parse(event.extendedProperties.private.origin)
                    );
                } catch (e) {
                    console.error('타입 검증에 실패했습니다.', event.summary, e);
                }
            })
            .filter((job): job is ParsedJob => job != null);
    },
};

export default CalendarAPI;
