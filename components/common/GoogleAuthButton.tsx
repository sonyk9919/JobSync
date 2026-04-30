import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleLogo from '../icons/GoogleLogo';

const GoogleAuthButton = () => {
    const { isLoggedIn, googleLogin, googleLogout } = useGoogleAuth();

    if (isLoggedIn()) {
        return (
            <button
                onClick={googleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 duration-150"
            >
                <GoogleLogo />
                <span className="text-sm text-gray-600">로그아웃</span>
            </button>
        );
    }

    return (
        <button
            onClick={googleLogin}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 duration-150"
        >
            <GoogleLogo />
            <span className="text-sm text-gray-600">구글 로그인</span>
        </button>
    );
};

export default GoogleAuthButton;
