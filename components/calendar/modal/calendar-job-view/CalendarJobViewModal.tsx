import ModalTemplate from '@/components/common/ModalTemplate';
import { ParsedJob } from '@/utils/parser/types';
import KanbanCard from '../../view/kanban/KanbanCard';

interface Props {
    isOpen: boolean;
    date: Date;
    jobs: ParsedJob[];
    onClose: () => void;
}

const CalendarJobViewModal = ({ isOpen, date, jobs, onClose }: Props) => {
    return (
        <ModalTemplate
            isOpen={isOpen}
            close={onClose}
            title={date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
        >
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto scrollbar-hide">
                {jobs.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-6">
                        마감 예정 공고가 없어요
                    </p>
                ) : (
                    jobs.map((job, i) => <KanbanCard key={i} job={job} />)
                )}
            </div>
        </ModalTemplate>
    );
};

export default CalendarJobViewModal;
