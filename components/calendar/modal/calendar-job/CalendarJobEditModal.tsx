import ModalTemplate from '@/components/common/ModalTemplate';
import useCalendarEditModal from '@/hooks/store/useCalendarEditModal';
import JobCalendarForm from '../../common/JobCalendarForm';
import useGoogleCalendarEventMutate from '@/hooks/calendar/mutate/useGoogleCalendarEventMutate';
import useRegisteredJobs from '@/hooks/store/useRegisteredJobs';
import { CalendarEventWithId, CalendarForm } from '@/types/calendar';
import { ParsedJob } from '@/utils/parser/types';
import DateUtils from '@/utils/DateUtils';

const CalendarJobEditModal = () => {
    const { event, setEvent } = useCalendarEditModal();
    const { updateEvent, isUpdateLoading, deleteEvent, isDeleteLoading } =
        useGoogleCalendarEventMutate();
    const { unregister } = useRegisteredJobs();

    const close = () => setEvent(null);
    const onSubmit = async (form: CalendarForm) => {
        if (!event) return;
        await updateEvent({ form, event });
        close();
    };
    const onRemove = async () => {
        if (!event) return;
        await deleteEvent(event);
        unregister(event.extendedProperties.private.origin.url);
        close();
    };

    const buildDefaultValues = (event: CalendarEventWithId<ParsedJob>) => ({
        title: event.summary,
        date: new Date(event.end.date).toISOString().split('T')[0],
        reminders: event.reminders.overrides.map((o) => DateUtils.fromMinutes(o.minutes)),
        memo: event.description,
    });

    return (
        <ModalTemplate isOpen={event !== null} title="캘린더 일정 수정" close={close}>
            {event && (
                <JobCalendarForm
                    onSubmit={onSubmit}
                    isSubmitLoading={isUpdateLoading}
                    actionLabel="수정"
                    defaultValues={buildDefaultValues(event)}
                    onClose={close}
                    onRemove={onRemove}
                    isRemoveLoading={isDeleteLoading}
                />
            )}
        </ModalTemplate>
    );
};

export default CalendarJobEditModal;
