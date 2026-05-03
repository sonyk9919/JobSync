import { CalendarEventWithId } from '@/types/calendar';
import { ParsedJob } from '@/utils/parser/types';

export interface CalendarAddModal {
    job: ParsedJob | null;
    setJob: (job: ParsedJob | null) => void;
}

export interface CalendarEditModal {
    event: CalendarEventWithId<ParsedJob> | null;
    setEvent: (event: CalendarEventWithId<ParsedJob> | null) => void;
}
export interface AccessToken {
    accessToken: string | null;
    expiredAt: number | null;
    hasHydrated: boolean;
    completeHydrate: () => void;
    login: (token: string, expiredAt: number) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}

export interface RegisteredJobs {
    registeredUrls: string[];
    register: (url: string) => void;
    registerAll: (urls: string[]) => void;
    unregister: (url: string) => void;
    isRegistered: (url: string) => boolean;
}

export interface CalendarSetUpModal {
    isOpen: boolean;
    setOpen: (open: boolean) => void;
}
