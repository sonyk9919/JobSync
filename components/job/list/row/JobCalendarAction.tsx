import Button from '@/components/common/Button';
import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import useGoogleCalendarEventMutate from '@/hooks/calendar/mutate/useGoogleCalendarEventMutate';
import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import { ParsedJob } from '@/utils/parser/types';
import { Loader2 } from 'lucide-react';

interface ActionAreaProps {
    selectedJobs: ParsedJob[];
}

const JobCalendarAction = ({ selectedJobs }: ActionAreaProps) => {
    const { isLoggedIn } = useGoogleAuth();
    const { registerAll } = useRegisteredJobs();
    const { addEvents, isAddAllLoading } = useGoogleCalendarEventMutate();
    const { createCalendar, isCreateLoading } = useGoogleCalendarId();
    const { hasCalendar, isCalendarLoaded } = useGoogleCalendarId();

    const handleAddAll = async () => {
        const events = await addEvents(selectedJobs);
        registerAll(events.map((e) => e.extendedProperties.private.origin.url));
    };

    if (!isLoggedIn()) {
        return (
            <div className="flex flex-col items-end gap-0.5">
                <GoogleAuthButton />
                <span className="text-xs text-gray-300">
                    구글 로그인 후 캘린더에 일정을 추가할 수 있어요
                </span>
            </div>
        );
    }

    if (!isCalendarLoaded) {
        return <Loader2 className="size-5 text-gray-300 animate-spin mr-2" />;
    }

    if (!hasCalendar) {
        return (
            <div className="flex flex-col items-end gap-0.5">
                <Button variant="primary" onClick={() => createCalendar()}>
                    {isCreateLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                    ) : (
                        '캘린더 연동하기'
                    )}
                </Button>
                <span className="text-xs text-gray-300">
                    먼저 채용 일정 전용 캘린더를 생성해주세요
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end gap-0.5">
            <Button variant="primary" onClick={handleAddAll} disabled={selectedJobs.length === 0}>
                {isAddAllLoading ? <Loader2 className="size-5 animate-spin" /> : '캘린더 추가'}
            </Button>
            <span className="text-xs text-gray-300">마감 1일 전 알림 · 메모에 공고 URL 포함</span>
        </div>
    );
};

export default JobCalendarAction;
