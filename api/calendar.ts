import { CalendarCreate, CalendarCreateBody, CalendarEvent, CalendarList } from '@/types/calendar';
import calendarAxios from './calendar-axios';
import { CALENDAR_NAME } from '@/hooks/calendar/useGoogleCalendarId';

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
};

export default CalendarAPI;
