import AbstractParser from "../AbstractParser";
import { CareerType, EducationType, EmploymentType, ParsedJob } from "../types";
import { ParsedWanted, WantedSchema } from "./types";

class WantedParser extends AbstractParser {
    public isSupport(document: Document): boolean {
        const url = document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '';
        return url.includes('wanted.co.kr');
    }

    public parse(document: Document): ParsedJob {
        const result = this.getJsonLd(document);

        return {
            company: result.hiringOrganization.name,
            dueDate: this.normalizeDate(result.validThrough),
            employmentType: this.normalizeEmploymentType(result.employmentType),
            careerRequirements: this.normalizeCareerType(result.experienceRequirements),
            educationType: EducationType.UNKNOWN,
            url: result.url,
        };
    }

    private getJsonLd(document: Document): ParsedWanted {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent ?? '');
                const result = WantedSchema.safeParse(json);
                if (result.success) return result.data;
            } catch (e) {
                console.error("파싱 중 오류가 발생했습니다.", e);
            }
        }
        throw new Error('JobPosting JSON-LD를 찾을 수 없습니다.');
    }

    private normalizeEmploymentType(value?: string): EmploymentType {
        if (!value) return EmploymentType.UNKNOWN;
        if (value.includes('정규직')) return EmploymentType.FULL_TIME;
        if (value.includes('계약직')) return EmploymentType.CONTRACT;
        if (value.includes('인턴')) return EmploymentType.INTERN;
        return EmploymentType.UNKNOWN;
    }

    private normalizeCareerType(value?: string[]): CareerType {
        if (!value || value.length === 0) return CareerType.UNKNOWN;
        const hasNew = value.some(v => v.includes("신입"));
        const hasExp = value.some(v => v.includes("경력"));
        if (hasNew && hasExp) return CareerType.ANY;
        if (hasExp) return CareerType.EXPERIENCED;
        if (hasNew) return CareerType.NEW;
        return CareerType.UNKNOWN;
    }
}

export default WantedParser;