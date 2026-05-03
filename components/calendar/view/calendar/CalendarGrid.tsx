import DateUtils from '@/utils/DateUtils';
import { ParsedJob } from '@/utils/parser/types';
import CalendarCell from './CalendarCell';
import { CalendarEventWithId } from '@/types/calendar';

interface Props {
    currentDate: Date;
    events: CalendarEventWithId<ParsedJob>[];
    onSelectDate: (date: Date) => void;
}

const CalendarGrid = ({ currentDate, events, onSelectDate }: Props) => {
    const cells = DateUtils.getCalendarCells(currentDate);
    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-7">
                {DateUtils.DAY_HEADERS.map((d) => (
                    <span key={d} className="text-xs text-gray-400 text-center py-1">
                        {d}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {cells.map((date, i) => {
                    const dayEvents = date
                        ? events.filter(
                              (e) => new Date(e.end.date).toDateString() === date.toDateString()
                          )
                        : [];
                    return (
                        <CalendarCell
                            key={i}
                            date={date}
                            events={dayEvents}
                            isCurrentMonth={date?.getMonth() === currentDate.getMonth()}
                            onClick={() => date && onSelectDate(date)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarGrid;
