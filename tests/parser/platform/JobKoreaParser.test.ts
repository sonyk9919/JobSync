import ParserHelper from '@/tests/helper/parser-helper';
import JobKoreaParser from '@/utils/parser/platform/JobKoreaParser';
import { CareerType, EducationType, EmploymentType } from '@/utils/parser/types';
import { describe, it, expect } from 'vitest';

const parser = new JobKoreaParser();

describe('JobKoreaParser', () => {
    describe('isSupport', () => {
        it('jobkorea.co.kr URL이면 true를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeJobKoreaDoc())).toBe(true);
        });

        it('다른 플랫폼 URL이면 false를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeJobPlanetDoc())).toBe(false);
            expect(parser.isSupport(ParserHelper.makeWantedDoc())).toBe(false);
        });
    });

    describe('parse', () => {
        describe('기본 필드', () => {
            it('title, company, url, address를 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeJobKoreaDoc());
                expect(result.title).toBe('프론트엔드 개발자');
                expect(result.company).toBe('잡코리아주식회사');
                expect(result.url).toBe('https://www.jobkorea.co.kr/recruit/1234');
                expect(result.address).toBe('서울 강남구');
            });
        });

        describe('dueDate', () => {
            it('validThrough를 Date로 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeJobKoreaDoc());
                expect(result.dueDate).toBeInstanceOf(Date);
                expect(result.dueDate?.getFullYear()).toBe(2025);
                expect(result.dueDate?.getMonth()).toBe(11);
            });

            it('validThrough가 없으면 null을 반환한다', () => {
                const result = parser.parse(
                    ParserHelper.makeJobKoreaDoc({ validThrough: undefined })
                );
                expect(result.dueDate).toBeNull();
            });
        });

        describe('employmentType', () => {
            it.each([
                ['FULL_TIME', EmploymentType.FULL_TIME],
                ['CONTRACTOR', EmploymentType.CONTRACT],
                [undefined, EmploymentType.UNKNOWN],
                ['기타', EmploymentType.UNKNOWN],
            ])('"%s" → %s', (input, expected) => {
                const result = parser.parse(
                    ParserHelper.makeJobKoreaDoc({ employmentType: input })
                );
                expect(result.employmentType).toBe(expected);
            });
        });

        describe('careerRequirements', () => {
            it.each([
                ['경력', CareerType.EXPERIENCED],
                ['신입', CareerType.NEW],
                ['신입·경력', CareerType.ANY],
                ['경력무관', CareerType.ANY],
                [undefined, CareerType.UNKNOWN],
            ])('"%s" → %s', (input, expected) => {
                const result = parser.parse(
                    ParserHelper.makeJobKoreaDoc({ experienceRequirements: input })
                );
                expect(result.careerRequirements).toBe(expected);
            });
        });

        describe('educationType', () => {
            it.each([
                ['학력무관', EducationType.ANY],
                ['고졸', EducationType.HIGH_SCHOOL],
                ['초대졸', EducationType.ASSOCIATE],
                ['대졸', EducationType.BACHELOR],
                ['대학원', EducationType.GRADUATE],
                ['석사', EducationType.MASTER],
                ['박사', EducationType.DOCTOR],
                ['', EducationType.UNKNOWN],
            ])('"%s" → %s', (input, expected) => {
                const result = parser.parse(
                    ParserHelper.makeJobKoreaDoc({ educationRequirements: input })
                );
                expect(result.educationType).toBe(expected);
            });
        });
    });
});
