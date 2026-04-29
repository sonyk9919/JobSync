import z from "zod";
import { ParsedJob } from "./types";

abstract class AbstractParser {
    protected normalizeDate(value?: string): Date | null{
        if (!value) return null;
        const normalized = value.replace(/\./g, '-').split('T')[0];
        const date = new Date(normalized);
        if (isNaN(date.getTime())) {
            throw new Error(`날짜 파싱 실패: ${value}`);
        }
        return date;
    }

    protected parsedJsonLd<T>(document: Document, schema: z.ZodType<T>): T {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent ?? '');
                const result = schema.safeParse(json);
                if (result.success) return result.data;
            } catch (e) {
                console.error("파싱 중 오류가 발생했습니다.", e);
            }
        }
        throw new Error('JobPosting JSON-LD를 찾을 수 없습니다.');
    }
    
    public abstract isSupport(document: Document): boolean;
    public abstract parse(document: Document): ParsedJob;
}

export default AbstractParser;