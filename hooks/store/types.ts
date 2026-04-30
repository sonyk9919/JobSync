import { ParsedJob } from "@/utils/parser/types";

export interface JobCalendarModal {
    job: ParsedJob | null;
    setJob: (job: ParsedJob | null) => void;
}