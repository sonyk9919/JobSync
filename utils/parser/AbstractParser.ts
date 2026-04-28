import { ParsedJob } from "./types";

abstract class AbstractParser {
    protected normalizeDate(value: string): Date {
        const normalized = value.replace(/\./g, '-').split('T')[0];
        const date = new Date(normalized);
        if (isNaN(date.getTime())) {
            throw new Error(`날짜 파싱 실패: ${value}`);
        }
        return date;
    }

    public abstract isSupport(document: Document): boolean;
    public abstract parse(document: Document): ParsedJob;
}

export default AbstractParser;