'use client';

import { useState } from 'react';
import useGoogleCalendarEvent from '@/hooks/calendar/useGoogleCalendarEvent';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarJobViewModal from '../../modal/calendar-job-view/CalendarJobViewModal';
import { Loader2 } from 'lucide-react';

const CalendarView = () => {
    const { jobs, isLoading } = useGoogleCalendarEvent();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    if (!jobs || isLoading) {
        return (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-6 justify-center">
                <Loader2 className="size-4 animate-spin" />
                일정을 불러오는 중이에요
            </div>
        );
    }

    const selectedJobs = selectedDate
        ? jobs.filter(
              (job) =>
                  job.dueDate?.getFullYear() === selectedDate.getFullYear() &&
                  job.dueDate?.getMonth() === selectedDate.getMonth() &&
                  job.dueDate?.getDate() === selectedDate.getDate()
          )
        : [];

    return (
        <div className="flex flex-col gap-4 w-full md:w-3xl">
            <CalendarHeader currentDate={currentDate} onChange={setCurrentDate} />
            <CalendarGrid currentDate={currentDate} jobs={jobs} onSelectDate={setSelectedDate} />
            {selectedDate && (
                <CalendarJobViewModal
                    isOpen={!!selectedJobs}
                    date={selectedDate}
                    jobs={selectedJobs}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

export default CalendarView;
