'use client';

import DateUtils from '@/utils/DateUtils';
import KanbanColumn from './KanbanColumn';
import { ParsedJob } from '@/utils/parser/types';
import { CalendarEventWithId } from '@/types/calendar';
import { useRef, useState, useEffect } from 'react';

interface Props {
    events: CalendarEventWithId<ParsedJob>[];
}

const KanbanBoard = ({ events }: Props) => {
    const { d3, d7, d10, later, closed } = DateUtils.groupByDday(events);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showFade, setShowFade] = useState(true);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const check = () => {
            setShowFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };

        check();
        el.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        return () => {
            el.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, []);

    return (
        <div className="relative w-full h-full">
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 w-full snap-x snap-proximity h-full"
            >
                <KanbanColumn title="D-3 이내" events={d3} />
                <KanbanColumn title="D-7 이내" events={d7} />
                <KanbanColumn title="D-10 이내" events={d10} />
                <KanbanColumn title="그 이후" events={later} />
                <div className="border-l border-dashed border-gray-200 shrink-0" />
                <KanbanColumn title="마감" events={closed} muted />
            </div>
            {showFade && (
                <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-linear-to-l from-white to-transparent" />
            )}
        </div>
    );
};

export default KanbanBoard;
