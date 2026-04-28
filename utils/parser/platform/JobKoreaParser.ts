import AbstractParser from "../AbstractParser";
import { CareerType, EducationType, EmploymentType, ParsedJob } from "../types";
import { JobKoreaSchema, ParsedJobKorea } from "./types";

class JobKoreaParser extends AbstractParser {
    public isSupport(document: Document): boolean {
        const url = document.querySelector('meta[property="og:url"]')
            ?.getAttribute("content") ?? '';
        return url.includes('jobkorea.co.kr');
    }

    public parse(document: Document): ParsedJob {
        const result = this.getJsonLd(document);
        return {
            employmentType: this.normalizeEmploymentType(result.employmentType),
            careerRequirements: this.normalizeCareerType(result.experienceRequirements),
            educationType: this.normalizeEducationType(result.educationRequirements),
            url: result.url,
            company: result.hiringOrganization.name,
            dueDate: this.normalizeDate(result.validThrough),
        }
    }

    private getJsonLd(document: Document): ParsedJobKorea {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent ?? '');
                const result = JobKoreaSchema.safeParse(json);
                if (result.success) return result.data;
            } catch {
                console.log("파싱 중 오류가 발생했습니다.");
            }
        }
        throw new Error('JobPosting JSON-LD를 찾을 수 없습니다.');
    }

    private normalizeEmploymentType(value: string): EmploymentType {
        if (value.includes('FULL_TIME')) return EmploymentType.FULL_TIME;
        if (value.includes('CONTRACTOR')) return EmploymentType.CONTRACT;
        return EmploymentType.UNKNOWN;
    }

    private normalizeCareerType(value: string): CareerType {
        if (value.includes('신입') && value.includes('경력') || value.includes('경력무관')) return CareerType.ANY;
        if (value.includes('경력')) return CareerType.EXPERIENCED;
        if (value.includes('신입')) return CareerType.NEW;
        return CareerType.UNKNOWN;
    }

    private normalizeEducationType(value: string): EducationType {
        if (value.includes("학력무관")) return EducationType.ANY;
        if (value.includes("고졸")) return EducationType.HIGH_SCHOOL;
        if (value.includes("초대졸")) return EducationType.ASSOCIATE;
        if (value.includes("석사")) return EducationType.MASTER;
        if (value.includes("박사")) return EducationType.DOCTOR;
        if (value.includes("대학원")) return EducationType.GRADUATE;
        if (value.includes("대졸")) return EducationType.BACHELOR;
        return EducationType.UNKNOWN;
    }
}

export default JobKoreaParser;