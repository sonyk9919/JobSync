import useJobCalendarModal from '@/hooks/store/useJobCalendarModal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from '@radix-ui/react-dialog';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleCalendarConnect from '@/components/calendar/common/GoogleCalendarConnect';
import JobCalendarContent from './JobCalendarContent';

const JobCalendarModal = () => {
    const { job, setJob } = useJobCalendarModal();
    const { isLoggedIn } = useGoogleAuth();

    return (
        <Dialog open={job !== null}>
            <DialogPortal>
                <DialogOverlay onClick={() => setJob(null)} className="fixed inset-0 bg-black/40" />
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md z-50 flex flex-col gap-4">
                    <DialogTitle className="text-base font-medium text-gray-900">
                        구글 캘린더에 추가
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    {isLoggedIn() ? <JobCalendarContent /> : <GoogleCalendarConnect />}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default JobCalendarModal;
