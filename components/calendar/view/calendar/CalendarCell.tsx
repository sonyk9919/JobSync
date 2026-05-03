import { CalendarEventWithId } from '@/types/calendar';
import { cn } from '@/utils/css/tailwind';
import { ParsedJob } from '@/utils/parser/types';

interface Props {
    date: Date | null;
    events: CalendarEventWithId<ParsedJob>[];
    isCurrentMonth: boolean;
    onClick: () => void;
}

const CalendarCell = ({ date, events, isCurrentMonth, onClick }: Props) => {
    const isToday = date?.toDateString() === new Date().toDateString();

    return (
        <div
            onClick={onClick}
            className={cn(
                'min-h-24 max-h-24 p-1 flex flex-col gap-0.5 rounded-lg cursor-pointer hover:bg-gray-50 duration-150',
                !isCurrentMonth && 'opacity-30'
            )}
        >
            <span
                className={cn(
                    'text-xs w-6 h-6 flex items-center justify-center rounded-full text-gray-900',
                    isToday && 'bg-blue-600 text-white font-medium'
                )}
            >
                {date?.getDate()}
            </span>
            {events.slice(0, 2).map((event, i) => (
                <span key={i} className="text-xs px-1 rounded bg-blue-50 text-blue-400 truncate">
                    {event.extendedProperties.private.origin.company}
                </span>
            ))}
            {events.length > 2 && (
                <span className="text-xs text-gray-400 font-medium">
                    + {events.length - 2}개 더
                </span>
            )}
        </div>
    );
};

export default CalendarCell;
