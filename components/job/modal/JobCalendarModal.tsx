import useJobCalendarModal from '@/hooks/store/useJobCalendarModal';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from '@radix-ui/react-dialog';
import JobCalendarForm from './JobCalendarForm';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import { Calendar } from 'lucide-react';

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
                    {isLoggedIn() ? (
                        <JobCalendarForm />
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-8 px-4">
                            <div className="rounded-full bg-blue-50 p-4">
                                <Calendar className="size-8 stroke-blue-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    구글 캘린더 연동
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    로그인하면 마감일을 캘린더에 자동으로 추가해드려요.
                                </p>
                            </div>
                            <GoogleAuthButton />
                        </div>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
};

export default JobCalendarModal;
