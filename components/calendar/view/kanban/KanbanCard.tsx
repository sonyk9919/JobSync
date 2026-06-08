'use client';

import useCalendarEditModal from '@/hooks/store/useCalendarEditModal';
import { CalendarEventWithId } from '@/types/calendar';
import DateUtils from '@/utils/DateUtils';
import { CareerType, EducationType, ParsedJob } from '@/utils/parser/types';
import { ExternalLink } from 'lucide-react';

interface Props {
    event: CalendarEventWithId<ParsedJob>;
    muted?: boolean;
}

const KanbanCard = ({ event, muted }: Props) => {
    const { setEvent } = useCalendarEditModal();
    const dueDate = new Date(event.end.date);
    const dday = DateUtils.getDday(dueDate);
    const job = event.extendedProperties.private.origin;

    const onOpenUrl = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(job.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            onClick={() => setEvent(event)}
            className={`cursor-pointer bg-white border border-gray-100 rounded-xl p-3 md:p-4 flex flex-col gap-2 hover:border-blue-100 hover:shadow-sm transition-all duration-200 ${muted ? 'opacity-40' : ''}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-xs text-gray-400 truncate">{job.company}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                </div>
                <span
                    className={`text-xs font-medium shrink-0 ${DateUtils.getDdayTextStyle(dday)}`}
                >
                    {DateUtils.getDdayLabel(dday)}
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex gap-1">
                    {job.careerRequirements !== CareerType.UNKNOWN && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">
                            {job.careerRequirements}
                        </span>
                    )}
                    {job.educationType !== EducationType.UNKNOWN && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">
                            {job.educationType}
                        </span>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                    {dueDate.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                </span>
                <button
                    onClick={onOpenUrl}
                    className="text-gray-300 hover:text-blue-400 duration-150"
                >
                    <ExternalLink className="size-3.5" />
                </button>
            </div>
        </div>
    );
};

export default KanbanCard;
