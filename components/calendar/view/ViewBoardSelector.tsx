'use client';

import { useState } from 'react';
import { LayoutGrid, Calendar } from 'lucide-react';
import IconButton from '@/components/common/IconButton';
import CalendarView from './calendar/CalendarView';
import KanbanBoard from './kanban/KanbanList';
import useGoogleCalendarEvent from '@/hooks/calendar/useGoogleCalendarEvent';
import { ParsedJob } from '@/utils/parser/types';
import GoogleCalendarSetup from '../common/GoogleCalendarSetup';
import GoogleCalendarConnect from '../common/GoogleCalendarConnect';
import useGoogleCalendarId from '@/hooks/calendar/useGoogleCalendarId';
import useGoogleAuth from '@/hooks/auth/useGoogleAuth';
import LoadingMessage from '@/components/common/LoadingMessage';

enum ViewType {
    KANBAN = 'kanban',
    CALENDAR = 'calendar',
}

const BoardViewSelector = () => {
    const [view, setView] = useState<ViewType>(ViewType.KANBAN);
    const { jobs, isLoading: isEventsLoaded } = useGoogleCalendarEvent();
    const { hasCalendar, isCalendarLoaded } = useGoogleCalendarId();
    const { isLoggedIn, isLoading: isLoggedInLoading } = useGoogleAuth();

    return (
        <div className="flex flex-col gap-4 w-310 max-w-full px-4 h-full mx-auto">
            <div className="flex gap-1 w-fit">
                <IconButton
                    active={view === ViewType.KANBAN}
                    onClick={() => setView(ViewType.KANBAN)}
                >
                    <LayoutGrid className="size-4" />
                </IconButton>
                <IconButton
                    active={view === ViewType.CALENDAR}
                    onClick={() => setView(ViewType.CALENDAR)}
                >
                    <Calendar className="size-4" />
                </IconButton>
            </div>
            <BoardContent
                view={view}
                jobs={jobs}
                isLoggedInLoading={isLoggedInLoading}
                isEventsLoaded={isEventsLoaded}
                isCalendarLoaded={isCalendarLoaded}
                isLoggedIn={isLoggedIn()}
                hasCalendar={hasCalendar}
            />
        </div>
    );
};

interface ContentProps {
    view: ViewType;
    jobs: ParsedJob[];
    isLoggedInLoading: boolean;
    isEventsLoaded: boolean;
    isCalendarLoaded: boolean;
    isLoggedIn: boolean;
    hasCalendar: boolean;
}

const BoardContent = ({
    view,
    jobs,
    isLoggedInLoading,
    isCalendarLoaded,
    isEventsLoaded,
    isLoggedIn,
    hasCalendar,
}: ContentProps) => {
    if (isLoggedInLoading) return <LoadingMessage>로그인 여부를 확인중이에요</LoadingMessage>;
    if (!isLoggedIn) return <GoogleCalendarConnect />;
    if (!isCalendarLoaded) return <LoadingMessage>캘린더를 불러오는 중이에요</LoadingMessage>;
    if (!hasCalendar) return <GoogleCalendarSetup />;
    if (isEventsLoaded) return <LoadingMessage>일정을 불러오는 중이에요</LoadingMessage>;
    if (view === ViewType.KANBAN) return <KanbanBoard jobs={jobs} />;
    return <CalendarView jobs={jobs} />;
};

export default BoardViewSelector;
