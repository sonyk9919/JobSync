import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    currentDate: Date;
    onChange: (date: Date) => void;
}

const CalendarHeader = ({ currentDate, onChange }: Props) => {
    const move = (delta: number) => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + delta);
        onChange(d);
    };

    return (
        <div className="flex items-center justify-between px-1">
            <button
                onClick={() => move(-1)}
                className="text-gray-400 hover:text-gray-600 duration-150"
            >
                <ChevronLeft className="size-5" />
            </button>
            <span className="text-sm font-medium text-gray-900">
                {currentDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </span>
            <button
                onClick={() => move(1)}
                className="text-gray-400 hover:text-gray-600 duration-150"
            >
                <ChevronRight className="size-5" />
            </button>
        </div>
    );
};

export default CalendarHeader;
