'use client';

import { ParsedJob } from '@/utils/parser/types';
import JobUploader from './JobUploader';
import { useState } from 'react';
import { toast } from 'sonner';
import JobList from '../list/JobList';
import JobCalendarModal from '../../calendar/modal/calendar-job-add/JobCalendarModal';

const JobImporter = () => {
    const [jobs, setJobs] = useState<ParsedJob[]>([]);

    const handleUpload = (job: ParsedJob) => {
        setJobs((prev) => {
            const already = prev.find((j) => j.url === job.url);
            if (already) {
                toast.error(`"${job.company}"는 이미 등록된 공고에요.`);
                return prev;
            }

            return [...prev, job].sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.getTime() - b.dueDate.getTime();
            });
        });
    };

    return (
        <div className="pl-5 pr-5 flex flex-col gap-3 h-full items-center">
            <JobUploader handleUpload={handleUpload} />
            <JobList jobs={jobs} />
            <JobCalendarModal />
        </div>
    );
};

export default JobImporter;
