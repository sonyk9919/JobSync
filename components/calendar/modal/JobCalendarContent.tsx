import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import GoogleCalendarSetup from '../common/GoogleCalendarSetup';
import JobCalendarForm from './JobCalendarForm';
import { Loader2 } from 'lucide-react';

const JobCalendarContent = () => {
    const { hasCalendar, isCalendarLoaded } = useGoogleCalendarId();

    if (!isCalendarLoaded)
        return (
            <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-xs">캘린더 정보를 불러오는 중이에요</span>
            </div>
        );

    return hasCalendar ? <JobCalendarForm /> : <GoogleCalendarSetup />;
};

export default JobCalendarContent;
