import { ParsedJob } from '@/utils/parser/types';
import KanbanCard from './KanbanCard';

interface Props {
    title: string;
    jobs: ParsedJob[];
}

const KanbanColumn = ({ title, jobs }: Props) => {
    return (
        <div className="flex flex-col gap-2 w-64 md:w-72 shrink-0 snap-center">
            <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-gray-500">{title}</span>
                <span className="text-xs text-gray-300">{jobs.length}</span>
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
                {jobs.length === 0 ? (
                    <div className="text-xs text-gray-300 text-center md:py-13 py-12 border border-dashed border-gray-100 rounded-xl">
                        공고가 없어요
                    </div>
                ) : (
                    jobs.map((job, i) => <KanbanCard key={i} job={job} />)
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
