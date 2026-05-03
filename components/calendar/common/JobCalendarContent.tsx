import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import GoogleCalendarSetup from './GoogleCalendarSetup';
import JobCalendarForm from './JobCalendarForm';
import LoadingMessage from '@/components/common/LoadingMessage';
import { ParsedJob } from '@/utils/parser/types';
import { CalendarForm, ReminderUnit } from '@/types/calendar';

interface Props {
    job: ParsedJob;
    close: () => void;
    onSubmit: (from: CalendarForm) => Promise<void>;
    actionLabel: string;
    isSubmitLoading: boolean;
}

const JobCalendarContent = ({ job, close, onSubmit, actionLabel, isSubmitLoading }: Props) => {
    const { hasCalendar, isCalendarLoaded } = useGoogleCalendarId();

    if (!isCalendarLoaded) return <LoadingMessage>캘린더 정보를 불러오는 중이에요</LoadingMessage>;

    return hasCalendar ? (
        <JobCalendarForm
            onClose={close}
            onSubmit={onSubmit}
            defaultValues={{
                title: `${job.company} - ${job.title}`,
                date:
                    job.dueDate?.toISOString().split('T')[0] ??
                    new Date().toISOString().split('T')[0],
                reminders: [{ value: 1, unit: ReminderUnit.DAYS }],
                memo: job.url,
            }}
            actionLabel={actionLabel}
            isSubmitLoading={isSubmitLoading}
        />
    ) : (
        <GoogleCalendarSetup />
    );
};

export default JobCalendarContent;
