import AbstractParser from "../AbstractParser";
import { CareerType, EducationType, EmploymentType, ParsedJob } from "../types";
import { JobPlanetSchema, ParsedJobPlanet } from "./types";

class JobplanetParser extends AbstractParser {
    private readonly LevelMap: Record<number, EducationType> = {
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
        const result = this.parsedJsonLd<ParsedJobPlanet>(document, JobPlanetSchema);
        return {
            title: result.title,
            company: result.hiringOrganization.name,
            dueDate: this.normalizeDate(result.validThrough),
            employmentType: this.normalizeEmploymentType(result.employmentType),
            careerRequirements: this.normalizeCareerType(result.experienceRequirements),
            educationType: this.parseEducationType(document),
            url: result.url,
        };
    }

    private parseEducationType(document: Document): EducationType {
        const match = document.documentElement.innerHTML
            .match(/"education_level_id":(\d+)/);
        if (!match) return EducationType.UNKNOWN;
        return this.LevelMap[Number(match[1])] ?? EducationType.UNKNOWN;
    }

    private normalizeEmploymentType(value?: string): EmploymentType {
        if (!value) return EmploymentType.UNKNOWN;
        if (value.includes('FULL_TIME')) return EmploymentType.FULL_TIME;
        if (value.includes('CONTRACTOR')) return EmploymentType.CONTRACT;
        return EmploymentType.UNKNOWN;
    }

    private normalizeCareerType(value?: string): CareerType {
        if (!value) return CareerType.UNKNOWN;
        if ((value.includes('신입') && value.includes('경력')) || value.includes('경력무관')) return CareerType.ANY;
        if (value.includes('경력')) return CareerType.EXPERIENCED;
        if (value.includes('신입')) return CareerType.NEW;
        return CareerType.UNKNOWN;
    }
}

export default JobplanetParser;