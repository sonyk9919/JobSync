import useJobCalendarModal from '@/hooks/store/useJobCalendarModal';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleCalendarConnect from '@/components/calendar/common/GoogleCalendarConnect';
import JobCalendarContent from './JobCalendarContent';
import ModalTemplate from '@/components/common/ModalTemplate';

const JobCalendarModal = () => {
    const { job, setJob } = useJobCalendarModal();
    const { isLoggedIn } = useGoogleAuth();

    return (
        <ModalTemplate title="구글 캘린더에 추가" isOpen={job !== null} close={() => setJob(null)}>
            {isLoggedIn() ? <JobCalendarContent /> : <GoogleCalendarConnect />}
        </ModalTemplate>
    );
};

export default JobCalendarModal;
