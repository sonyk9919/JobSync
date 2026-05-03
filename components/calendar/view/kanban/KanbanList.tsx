'use client';

import DateUtils from '@/utils/DateUtils';
import KanbanColumn from './KanbanColumn';
import { ParsedJob } from '@/utils/parser/types';

interface Props {
    jobs: ParsedJob[];
}

const KanbanBoard = ({ jobs }: Props) => {
    const { d3, d7, d10, later } = DateUtils.groupByDday(jobs);

    return (
        <div className="flex flex-col gap-3 h-full">
            <p className="text-xs text-red-500 font-bold text">마감된 공고는 표시되지 않아요</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 w-full max-w-fit snap-x snap-mandatory h-full">
                <KanbanColumn title="D-3 이내" jobs={d3} />
                <KanbanColumn title="D-7 이내" jobs={d7} />
                <KanbanColumn title="D-10 이내" jobs={d10} />
                <KanbanColumn title="그 이후" jobs={later} />
            </div>
        </div>
    );
};

export default KanbanBoard;
