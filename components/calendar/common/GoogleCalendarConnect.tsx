import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import { Calendar } from 'lucide-react';

const GoogleCalendarConnect = () => {
    return (
        <div className="flex flex-col items-center gap-4 py-8 px-4">
            <div className="rounded-full bg-blue-50 p-4">
                <Calendar className="size-8 stroke-blue-500" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    구글 캘린더 연동
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    구글 캘린더와 연동해 일정과 알림을 관리해요.
                </p>
            </div>
            <GoogleAuthButton />
        </div>
    );
};

export default GoogleCalendarConnect;
