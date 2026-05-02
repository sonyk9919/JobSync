import Button from '@/components/common/Button';
import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import { Calendar, Loader2 } from 'lucide-react';

const GoogleCalendarSetup = () => {
    const { createCalendar, isCreateLoading } = useGoogleCalendarId();
    return (
        <div className="flex flex-col items-center gap-4 py-8 px-4">
            <div className="rounded-full bg-blue-50 p-4">
                <Calendar className="size-8 stroke-blue-500" />
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    JobSync 캘린더 생성
                </p>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    일정 관리를 위해 구글 캘린더에{' '}
                    <span className="text-gray-600 font-medium">JobSync</span> 캘린더를 생성해요.
                </p>
                <p className="text-xs text-amber-500 mt-1.5 leading-relaxed">
                    캘린더 이름을 변경하면 서비스가 캘린더를 감지하지 못할 수 있어요.
                </p>
            </div>
            <Button variant="primary" onClick={() => createCalendar()}>
                {isCreateLoading ? <Loader2 className="size-4 animate-spin" /> : '캘린더 생성'}
            </Button>
        </div>
    );
};

export default GoogleCalendarSetup;
