import AbstractParser from "../AbstractParser";
import { CareerType, EducationType, EmploymentType, ParsedJob } from "../types";
import { JobPlanetSchema, ParsedJobPlanet } from "./types";

class JobplanetParser extends AbstractParser {
    private LevelMap: Record<number, EducationType> = {
        3: EducationType.HIGH_SCHOOL,
        4: EducationType.ASSOCIATE,
        5: EducationType.BACHELOR,
        6: EducationType.GRADUATE,
        7: EducationType.MASTER,
        8: EducationType.DOCTOR,
        9: EducationType.ANY,
    };

    public isSupport(document: Document): boolean {
        const content = document
            .querySelector('meta[property="og:url"]')
            ?.getAttribute('content');
        return content?.includes('jobplanet.co.kr') ?? false;
    }

    public parse(document: Document): ParsedJob {
        const result = this.getJsonLd(document);
        return {
            company: result.hiringOrganization.name,
            dueDate: this.normalizeDate(result.validThrough),
            employmentType: this.normalizeEmploymentType(result.employmentType),
            careerRequirements: this.normalizeCareerType(result.experienceRequirements),
            educationType: this.parseEducationType(document),
            url: result.url,
        };
    }

    private getJsonLd(document: Document): ParsedJobPlanet {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const json = JSON.parse(script.textContent ?? '');
                const result = JobPlanetSchema.safeParse(json);
                if (result.success) return result.data;
            } catch (e) {
                console.error("파싱 중 오류가 발생했습니다.", e);
            }
        }
        throw new Error('JobPosting JSON-LD를 찾을 수 없습니다.');
    }

    private parseEducationType(document: Document): EducationType {
        const match = document.documentElement.innerHTML
            .match(/"education_level_id":(\d+)/);
        if (!match) return EducationType.UNKNOWN;
        return this.LevelMap[Number(match[1])] ?? EducationType.UNKNOWN;
    }

    private normalizeEmploymentType(value: string): EmploymentType {
        if (value.includes('FULL_TIME')) return EmploymentType.FULL_TIME;
        if (value.includes('CONTRACTOR')) return EmploymentType.CONTRACT;
        return EmploymentType.UNKNOWN;
    }

    private normalizeCareerType(value: string): CareerType {
        if ((value.includes('신입') && value.includes('경력')) || value.includes('경력무관')) return CareerType.ANY;
        if (value.includes('경력')) return CareerType.EXPERIENCED;
        if (value.includes('신입')) return CareerType.NEW;
        return CareerType.UNKNOWN;
    }
}

export default JobplanetParser;