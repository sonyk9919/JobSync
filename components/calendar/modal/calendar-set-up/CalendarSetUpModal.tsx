import ModalTemplate from '@/components/common/ModalTemplate';
import useCalendarSetUpModal from '@/hooks/store/useCalendarSetUpModal';
import GoogleCalendarSetup from '../../common/GoogleCalendarSetup';

const CalendarSetUpModal = () => {
    const { isOpen, setOpen } = useCalendarSetUpModal();

    return (
        <ModalTemplate title="구글 캘린더 생성" isOpen={isOpen} close={() => setOpen(false)}>
            <GoogleCalendarSetup />
        </ModalTemplate>
    );
};

export default CalendarSetUpModal;
