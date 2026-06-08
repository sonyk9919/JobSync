import { ParsedJob } from '@/utils/parser/types';
import KanbanCard from './KanbanCard';
import { CalendarEventWithId } from '@/types/calendar';

interface Props {
    title: string;
    events: CalendarEventWithId<ParsedJob>[];
    muted?: boolean;
}

const KanbanColumn = ({ title, events, muted }: Props) => {
    return (
        <div className="flex flex-col gap-2 w-64 md:w-72 shrink-0 snap-center">
            <div className="flex items-center justify-between px-1">
                <span
                    className={`text-xs font-medium ${muted ? 'text-gray-300' : 'text-gray-500'}`}
                >
                    {title}
                </span>
                <span className="text-xs text-gray-300">{events.length}</span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
                {events.length === 0 ? (
                    <div className="text-xs text-gray-300 text-center md:py-13 py-12 border border-dashed border-gray-100 rounded-xl">
                        공고가 없어요
                    </div>
                ) : (
                    events.map((event) => <KanbanCard key={event.id} event={event} muted={muted} />)
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
