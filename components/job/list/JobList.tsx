import { ParsedJob } from '@/utils/parser/types';
import { useState } from 'react';
import { LayoutGrid, List, FileSearch } from 'lucide-react';
import IconButton from '@/components/common/IconButton';
import JobCardLayout from './card/JobCardLayout';
import JobRowLayout from './row/JobRowLayout';

interface Props {
    jobs: ParsedJob[];
}

const enum ViewType {
    CARD,
    LIST,
}

const JobList = ({ jobs }: Props) => {
    const [view, setView] = useState<ViewType>(ViewType.CARD);

    return (
        <div className="flex flex-col items-center md:w-3xl w-full h-full overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between md:w-3xl w-full sticky top-0 bg-white pb-2">
                <span className="text-xs text-gray-400">{jobs.length}개의 공고</span>
                <div className="flex gap-1">
                    <IconButton
                        active={view === ViewType.CARD}
                        onClick={() => setView(ViewType.CARD)}
                    >
                        <LayoutGrid className="size-4" />
                    </IconButton>
                    <IconButton
                        active={view === ViewType.LIST}
                        onClick={() => setView(ViewType.LIST)}
                    >
                        <List className="size-4" />
                    </IconButton>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-16 text-gray-300">
                    <FileSearch className="size-10" />
                    <p className="text-sm">업로드된 공고가 없어요</p>
                </div>
            ) : (
                <>
                    {view === ViewType.CARD && <JobCardLayout jobs={jobs} />}
                    {view === ViewType.LIST && <JobRowLayout jobs={jobs} />}
                </>
            )}
        </div>
    );
};

export default JobList;
