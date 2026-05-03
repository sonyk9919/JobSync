'use client';

import { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarJobViewModal from '../../modal/calendar-job/CalendarJobViewModal';
import { ParsedJob } from '@/utils/parser/types';
import { CalendarEventWithId } from '@/types/calendar';

interface Props {
    events: CalendarEventWithId<ParsedJob>[];
}

const CalendarView = ({ events }: Props) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const selectedEvents = selectedDate
        ? events.filter((event) => {
              const date = new Date(event.end.date);
              return (
                  date.getFullYear() === selectedDate.getFullYear() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getDate() === selectedDate.getDate()
              );
          })
        : [];

    return (
        <div className="flex flex-col gap-4 w-full md:w-300 max-w-full">
            <CalendarHeader currentDate={currentDate} onChange={setCurrentDate} />
            <CalendarGrid
                currentDate={currentDate}
                events={events}
                onSelectDate={setSelectedDate}
            />
            {selectedDate && (
                <CalendarJobViewModal
                    isOpen={!!selectedDate}
                    date={selectedDate}
                    events={selectedEvents}
                    onClose={() => setSelectedDate(null)}
                />
            )}
        </div>
    );
};

export default CalendarView;
