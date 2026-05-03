import axios from 'axios';
import useAccessToken from '@/hooks/store/useAccessToken';
import useCalendarEditModal from '@/hooks/store/useCalendarEditModal';
import useCalendarAddModal from '@/hooks/store/useCalendarAddModal';

const calendarAxios = axios.create({
    baseURL: 'https://www.googleapis.com/calendar/v3',
    headers: {
        'Content-Type': 'application/json',
    },
});

calendarAxios.interceptors.request.use((config) => {
    const { accessToken } = useAccessToken.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
        throw new Error('구글 로그인이 필요해요.');
    }
    return config;
});

calendarAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAccessToken.getState().logout();
            useCalendarEditModal.getState().setEvent(null);
            useCalendarAddModal.getState().setJob(null);
            throw new Error('로그인 세션이 만료됐어요. 다시 로그인 후 시도해 주세요.');
        }
        throw error;
    }
);

export default calendarAxios;
