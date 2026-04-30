import { toast } from 'sonner';
import useAccessToken from '../store/useAccessToken';

const SCOPE = [
    'https://www.googleapis.com/auth/calendar.app.created',
    'https://www.googleapis.com/auth/calendar.calendarlist',
].join(' ');

const useGoogleAuth = () => {
    const { accessToken, login, logout, isLoggedIn } = useAccessToken();

    const googleLogin = () => {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            scope: SCOPE,
            callback: (response) => {
                if (response.error) {
                    toast.error('구글 로그인에 실패했어요.');
                    return;
                }
                login(response.access_token, Date.now() + Number(response.expires_in) * 1000);
            },
        });
        client.requestAccessToken();
    };

    const googleLogout = () => {
        if (!accessToken) return;
        google.accounts.oauth2.revoke(accessToken, () => logout());
    };

    return { accessToken, googleLogin, googleLogout, isLoggedIn };
};

export default useGoogleAuth;
