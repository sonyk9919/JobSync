import { toast } from 'sonner';
import useAccessToken from '../store/useAccessToken';

const SCOPE = [
    'https://www.googleapis.com/auth/calendar.app.created',
    'https://www.googleapis.com/auth/calendar.calendarlist',
].join(' ');

const useGoogleAuth = () => {
    const { accessToken, login, logout, isLoggedIn, hasHydrated } = useAccessToken();

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

    const isLoggedInSafe = () => hasHydrated && isLoggedIn();

    return {
        accessToken,
        googleLogin,
        googleLogout,
        isLoggedIn: isLoggedInSafe,
        isLoading: !hasHydrated,
    };
};

export default useGoogleAuth;
