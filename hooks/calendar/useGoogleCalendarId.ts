import CalendarAPI from '@/api/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const CALENDAR_NAME = 'JobSync';

const useGoogleCalendarId = () => {
    const queryClient = useQueryClient();
    const {
        data = null,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['CalendarId'],
        queryFn: CalendarAPI.getCalendarId,
    });
    const { mutateAsync } = useMutation({
        mutationFn: async () => await CalendarAPI.createCalendar({ summary: CALENDAR_NAME }),
        onSuccess: (id) => {
            queryClient.setQueryData(['CalendarId'], id);
        },
    });

    return {
        calendarId: data,
        createCalendar: mutateAsync,
        isCalendarLoaded: isSuccess,
        hasCalendar: data !== null && isSuccess,
        error,
    };
};

export default useGoogleCalendarId;
