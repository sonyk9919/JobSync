import { ParsedJob } from '@/utils/parser/types';
import { useState } from 'react';
import JobRow from './JobRow';
import Button from '@/components/common/Button';
import { CheckSquare, Square } from 'lucide-react';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import GoogleAuthButton from '@/components/common/GoogleAuthButton';
import useGoogleCalendarEvent from '@/hooks/calendar/useGoogleCalendarEvent';

interface Props {
    jobs: ParsedJob[];
}

const JobRowLayout = ({ jobs }: Props) => {
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
    const { addEvents } = useGoogleCalendarEvent();
    const { isLoggedIn } = useGoogleAuth();

    const handleSelect = (url: string) => {
        setSelectedUrls((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const handleSelectAll = () => {
        setSelectedUrls(selectedUrls.length === jobs.length ? [] : jobs.map((j) => j.url));
    };

    const handleBulkAdd = () => {
        const selectedJobs = jobs.filter((j) => selectedUrls.includes(j.url));
        addEvents(selectedJobs);
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
                <div className="flex flex-col items-end gap-0.5">
                    {isLoggedIn() ? (
                        <>
                            <Button
                                variant="primary"
                                onClick={handleBulkAdd}
                                disabled={selectedUrls.length === 0}
                            >
                                캘린더 추가
                            </Button>
                            <span className="text-xs text-gray-300">
                                마감 1일 전 알림 · 메모에 공고 URL 포함
                            </span>
                        </>
                    ) : (
                        <>
                            <GoogleAuthButton />
                            <span className="text-xs text-gray-300">
                                구글 로그인 후 캘린더에 일정을 추가할 수 있어요
                            </span>
                        </>
                    )}
                </div>
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
