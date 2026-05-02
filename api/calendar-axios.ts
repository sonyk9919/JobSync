import axios from 'axios';
import useAccessToken from '@/hooks/store/useAccessToken';

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

export default calendarAxios;
