import { useQuery } from '@tanstack/react-query';
import useGoogleCalendarId from './useGoogleCalendarId';
import CalendarAPI from '@/api/calendar';

const useGoogleCalendarEvent = () => {
    const { calendarId, hasCalendar } = useGoogleCalendarId();
    const {
        data: jobs = [],
        isLoading,
        isSuccess,
    } = useQuery({
        queryKey: ['CalendarEvents', calendarId],
        queryFn: async () => {
            if (!hasCalendar || !calendarId) {
                throw new Error('캘린더 생성 후 재시도 해주세요.');
            }
            return await CalendarAPI.getEvents(calendarId);
        },
        enabled: hasCalendar,
    });

    return { jobs, isLoading: isLoading || !isSuccess };
};

export default useGoogleCalendarEvent;
