'use client';

import DateUtils from '@/utils/DateUtils';
import KanbanColumn from './KanbanColumn';
import useGoogleCalendarEvent from '@/hooks/calendar/useGoogleCalendarEvent';
import { Loader2 } from 'lucide-react';

const KanbanBoard = () => {
    const { jobs, isLoading } = useGoogleCalendarEvent();
    const { d3, d7, d10, later } = DateUtils.groupByDday(jobs);

    if (!jobs || isLoading) {
        return (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
                <Loader2 className="size-4 animate-spin" />
                일정을 불러오는 중이에요
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs text-red-500 font-bold text">마감된 공고는 표시되지 않아요</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                <KanbanColumn title="D-3 이내" jobs={d3} />
                <KanbanColumn title="D-7 이내" jobs={d7} />
                <KanbanColumn title="D-10 이내" jobs={d10} />
                <KanbanColumn title="그 이후" jobs={later} />
            </div>
        </div>
    );
};

export default KanbanBoard;
