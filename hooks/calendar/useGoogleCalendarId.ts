import CalendarAPI from '@/api/calendar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useGoogleAuth from '../auth/useGoogleAuth';
import { toast } from 'sonner';

export const CALENDAR_NAME = 'JobSync';

const useGoogleCalendarId = () => {
    const queryClient = useQueryClient();
    const { accessToken } = useGoogleAuth();
    const {
        data = null,
        error,
        isSuccess,
    } = useQuery({
        queryKey: ['CalendarId'],
        queryFn: CalendarAPI.getCalendarId,
        enabled: !!accessToken,
    });
    const { mutateAsync, isPending } = useMutation({
        mutationFn: async () => await CalendarAPI.createCalendar({ summary: CALENDAR_NAME }),
        onSuccess: (id) => {
            queryClient.setQueryData(['CalendarId'], id);
            console.log(id);
            toast.success('캘린더를 생성했어요.');
        },
    });

    return {
        calendarId: data,
        createCalendar: mutateAsync,
        isCalendarLoaded: isSuccess,
        hasCalendar: data !== null && isSuccess,
        error,
        isCreateLoading: isPending,
    };
};

export default useGoogleCalendarId;
