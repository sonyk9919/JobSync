'use client';

import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarJobViewModal from '../../modal/calendar-job-view/CalendarJobViewModal';
import { ParsedJob } from '@/utils/parser/types';

interface Props {
    jobs: ParsedJob[];
}

const CalendarView = ({ jobs }: Props) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const selectedJobs = selectedDate
        ? jobs.filter(
              (job) =>
                  job.dueDate?.getFullYear() === selectedDate.getFullYear() &&
                  job.dueDate?.getMonth() === selectedDate.getMonth() &&
                  job.dueDate?.getDate() === selectedDate.getDate()
          )
        : [];

    return (
        <div className="flex flex-col gap-4 w-full md:w-300 max-w-full">
            <CalendarHeader currentDate={currentDate} onChange={setCurrentDate} />
            <CalendarGrid currentDate={currentDate} jobs={jobs} onSelectDate={setSelectedDate} />
            {selectedDate && (
                <CalendarJobViewModal
                    isOpen={!!selectedDate}
                    date={selectedDate}
                    jobs={selectedJobs}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

export default CalendarView;
