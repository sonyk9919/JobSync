'use client';

import DateUtils from '@/utils/DateUtils';
import KanbanColumn from './KanbanColumn';
import { ParsedJob } from '@/utils/parser/types';
import { CalendarEventWithId } from '@/types/calendar';

interface Props {
    events: CalendarEventWithId<ParsedJob>[];
}

const KanbanBoard = ({ events }: Props) => {
    const { d3, d7, d10, later, closed } = DateUtils.groupByDday(events);

    return (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 w-full max-w-fit snap-x snap-mandatory h-full">
            <KanbanColumn title="D-3 이내" events={d3} />
            <KanbanColumn title="D-7 이내" events={d7} />
            <KanbanColumn title="D-10 이내" events={d10} />
            <KanbanColumn title="그 이후" events={later} />
            <div className="border-l border-dashed border-gray-200 shrink-0" />
            <KanbanColumn title="마감" events={closed} muted />
        </div>
    );
};

export default KanbanBoard;
