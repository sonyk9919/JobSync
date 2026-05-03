import KanbanBoard from '@/components/calendar/view/kanban/KanbanList';
import PageContainer from '@/components/common/PageContainter';

export default function Home() {
    return (
        <PageContainer>
            <KanbanBoard />
        </PageContainer>
    );
}
