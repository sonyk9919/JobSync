import ModalTemplate from '@/components/common/ModalTemplate';
import { ParsedJob } from '@/utils/parser/types';
import KanbanCard from '../../view/kanban/KanbanCard';
import { CalendarEventWithId } from '@/types/calendar';

interface Props {
    isOpen: boolean;
    date: Date;
    events: CalendarEventWithId<ParsedJob>[];
    onClose: () => void;
}

const CalendarJobViewModal = ({ isOpen, date, events, onClose }: Props) => {
    return (
        <ModalTemplate
            isOpen={isOpen}
            close={onClose}
            title={date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
        >
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                {events.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">
                        마감 예정 공고가 없어요
                    </p>
                ) : (
                    events.map((event, i) => <KanbanCard key={i} event={event} />)
                )}
            </div>
        </ModalTemplate>
    );
};

export default CalendarJobViewModal;
