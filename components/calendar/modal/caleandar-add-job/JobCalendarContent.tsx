import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import GoogleCalendarSetup from '../../common/GoogleCalendarSetup';
import JobCalendarForm from './JobCalendarForm';
import LoadingMessage from '@/components/common/LoadingMessage';

const JobCalendarContent = () => {
    const { hasCalendar, isCalendarLoaded } = useGoogleCalendarId();

    if (!isCalendarLoaded) return <LoadingMessage>캘린더 정보를 불러오는 중이에요</LoadingMessage>;
    return hasCalendar ? <JobCalendarForm /> : <GoogleCalendarSetup />;
};

export default JobCalendarContent;
