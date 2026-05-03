import { describe, it, expect } from 'vitest';
import WantedParser from '@/utils/parser/platform/WantedParser';
import { CareerType, EducationType, EmploymentType } from '@/utils/parser/types';
import ParserHelper from '@/tests/helper/parser-helper';

const parser = new WantedParser();

describe('WantedParser', () => {
    describe('isSupport', () => {
        it('wanted.co.kr URL이면 true를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeWantedDoc())).toBe(true);
        });

        it('다른 플랫폼 URL이면 false를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeJobKoreaDoc())).toBe(false);
            expect(parser.isSupport(ParserHelper.makeJobPlanetDoc())).toBe(false);
        });
    });

    describe('parse', () => {
        describe('기본 필드', () => {
            it('title, company, url을 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeWantedDoc());
                expect(result.title).toBe('풀스택 개발자');
                expect(result.company).toBe('원티드랩');
                expect(result.url).toBe('https://www.wanted.co.kr/wd/1234');
            });

            it('address를 addressRegion + addressLocality로 합친다', () => {
                const result = parser.parse(ParserHelper.makeWantedDoc());
                expect(result.address).toBe('서울 강남구');
            });

            it('educationType은 항상 UNKNOWN이다', () => {
                const result = parser.parse(ParserHelper.makeWantedDoc());
                expect(result.educationType).toBe(EducationType.UNKNOWN);
            });
        });

        describe('dueDate', () => {
            it('T 이후를 제거하고 날짜를 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeWantedDoc());
                expect(result.dueDate).toBeInstanceOf(Date);
                expect(result.dueDate?.getFullYear()).toBe(2025);
                expect(result.dueDate?.getMonth()).toBe(9);
            });

            it('validThrough가 없으면 null을 반환한다', () => {
                const result = parser.parse(
                    ParserHelper.makeWantedDoc({ validThrough: undefined })
                );
                expect(result.dueDate).toBeNull();
            });
        });

        describe('employmentType', () => {
            it.each([
                ['정규직', EmploymentType.FULL_TIME],
                ['계약직', EmploymentType.CONTRACT],
                ['인턴', EmploymentType.INTERN],
                [undefined, EmploymentType.UNKNOWN],
                ['기타', EmploymentType.UNKNOWN],
            ])('"%s" → %s', (input, expected) => {
                const result = parser.parse(ParserHelper.makeWantedDoc({ employmentType: input }));
                expect(result.employmentType).toBe(expected);
            });
        });

        describe('careerRequirements', () => {
            it.each([
                [['신입', '경력'], CareerType.ANY],
                [['경력'], CareerType.EXPERIENCED],
                [['신입'], CareerType.NEW],
                [[], CareerType.UNKNOWN],
                [undefined, CareerType.UNKNOWN],
            ])('%j → %s', (input, expected) => {
                const result = parser.parse(
                    ParserHelper.makeWantedDoc({ experienceRequirements: input })
                );
                expect(result.careerRequirements).toBe(expected);
            });
        });
    });
});
