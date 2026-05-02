import { ParsedJob } from '@/utils/parser/types';
import { useState } from 'react';
import JobRow from './JobRow';
import { CheckSquare, Square } from 'lucide-react';
import JobCalendarAction from './JobCalendarAction';

interface Props {
    jobs: ParsedJob[];
}

const JobRowLayout = ({ jobs }: Props) => {
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    const handleSelect = (url: string) => {
        setSelectedUrls((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const handleSelectAll = () => {
        setSelectedUrls(selectedUrls.length === jobs.length ? [] : jobs.map((j) => j.url));
    };

    const isAllSelected = selectedUrls.length === jobs.length && jobs.length > 0;

    return (
        <div className="flex flex-col gap-2 md:w-3xl w-full">
            <div className="flex items-center justify-between px-1 sticky top-8 bg-white py-2">
                <div
                    className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer"
                    onClick={handleSelectAll}
                >
                    {isAllSelected ? (
                        <CheckSquare className="size-4 text-blue-400" />
                    ) : (
                        <Square className="size-4 text-gray-300" />
                    )}
                    전체 선택
                </div>
                <JobCalendarAction
                    selectedJobs={jobs.filter((job) => selectedUrls.includes(job.url))}
                />
            </div>

            <div className="flex flex-col gap-2">
                {jobs.map((job) => (
                    <JobRow
                        key={job.url}
                        job={job}
                        selected={selectedUrls.includes(job.url)}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default JobRowLayout;
