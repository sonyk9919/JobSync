import useJobCalendarModal from '@/hooks/store/useJobCalendarModal';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleCalendarConnect from '@/components/calendar/common/GoogleCalendarConnect';
import JobCalendarContent from '../../common/JobCalendarContent';
import ModalTemplate from '@/components/common/ModalTemplate';
import useGoogleCalendarEventMutate from '@/hooks/calendar/mutate/useGoogleCalendarEventMutate';
import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import { CalendarForm } from '@/types/calendar';

const JobCalendarModal = () => {
    const { job, setJob } = useJobCalendarModal();
    const { isLoggedIn } = useGoogleAuth();
    const { addEvent, isAddLoading } = useGoogleCalendarEventMutate();
    const { register } = useRegisteredJobs();

    const close = () => setJob(null);
    const onSubmit = async (form: CalendarForm) => {
        if (!job) return;
        const event = await addEvent({ job, form });
        register(event.extendedProperties.private.origin.url);
        close();
    };

    return (
        <ModalTemplate title="구글 캘린더에 추가" isOpen={job !== null} close={close}>
            {job &&
                (isLoggedIn() ? (
                    <JobCalendarContent
                        job={job}
                        actionLabel="추가"
                        onSubmit={onSubmit}
                        isSubmitLoading={isAddLoading}
                        close={close}
                    />
                ) : (
                    <GoogleCalendarConnect />
                ))}
        </ModalTemplate>
    );
};

export default JobCalendarModal;
