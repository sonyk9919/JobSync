import { ParsedJob } from '@/utils/parser/types';

export interface JobCalendarModal {
    job: ParsedJob | null;
    setJob: (job: ParsedJob | null) => void;
}

export interface AccessToken {
    accessToken: string | null;
    expiredAt: number | null;
    login: (token: string, expiredAt: number) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}
