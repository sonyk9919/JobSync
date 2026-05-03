import { describe, it, expect } from 'vitest';
import { CareerType, EducationType, EmploymentType } from '@/utils/parser/types';
import JobplanetParser from '@/utils/parser/platform/JobPlanetParser';
import ParserHelper from '@/tests/helper/parser-helper';

const parser = new JobplanetParser();

describe('JobPlanetParser', () => {
    describe('isSupport', () => {
        it('jobplanet.co.kr URL이면 true를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeJobPlanetDoc())).toBe(true);
        });

        it('다른 플랫폼 URL이면 false를 반환한다', () => {
            expect(parser.isSupport(ParserHelper.makeJobKoreaDoc())).toBe(false);
            expect(parser.isSupport(ParserHelper.makeWantedDoc())).toBe(false);
        });
    });

    describe('parse', () => {
        describe('기본 필드', () => {
            it('title, company, url, address를 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeJobPlanetDoc());
                expect(result.title).toBe('백엔드 개발자');
                expect(result.company).toBe('잡플래닛주식회사');
                expect(result.url).toBe('https://www.jobplanet.co.kr/job/1234');
                expect(result.address).toBe('서울');
            });
        });

        describe('dueDate', () => {
            it('점(.) 구분자 날짜를 Date로 파싱한다', () => {
                const result = parser.parse(ParserHelper.makeJobPlanetDoc());
                expect(result.dueDate).toBeInstanceOf(Date);
                expect(result.dueDate?.getFullYear()).toBe(2025);
                expect(result.dueDate?.getMonth()).toBe(10); // 11월
            });

            it('validThrough가 없으면 null을 반환한다', () => {
                const result = parser.parse(
                    ParserHelper.makeJobPlanetDoc({ validThrough: undefined })
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
                    ParserHelper.makeJobPlanetDoc({ employmentType: input })
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
                    ParserHelper.makeJobPlanetDoc({ experienceRequirements: input })
                );
                expect(result.careerRequirements).toBe(expected);
            });
        });

        describe('educationType (education_level_id)', () => {
            it.each([
                [3, EducationType.HIGH_SCHOOL],
                [4, EducationType.ASSOCIATE],
                [5, EducationType.BACHELOR],
                [6, EducationType.GRADUATE],
                [7, EducationType.MASTER],
                [8, EducationType.DOCTOR],
                [9, EducationType.ANY],
            ])('education_level_id %i → %s', (id, expected) => {
                const doc = new DOMParser().parseFromString(
                    `
                    <html>
                        <head>
                            <meta property="og:url" content="https://www.jobplanet.co.kr/job/1234" />
                            <script type="application/ld+json">${JSON.stringify({
                                '@type': 'JobPosting',
                                title: '테스트',
                                hiringOrganization: { name: '테스트사' },
                                url: 'https://www.jobplanet.co.kr/job/1234',
                                jobLocation: { address: { addressRegion: '서울' } },
                            })}</script>
                        </head>
                        <body>"education_level_id":${id}</body>
                    </html>
                `,
                    'text/html'
                );
                expect(parser.parse(doc).educationType).toBe(expected);
            });

            it('education_level_id가 없으면 UNKNOWN이다', () => {
                const doc = new DOMParser().parseFromString(
                    `
                    <html>
                        <head>
                            <meta property="og:url" content="https://www.jobplanet.co.kr/job/1234" />
                            <script type="application/ld+json">${JSON.stringify({
                                '@type': 'JobPosting',
                                title: '테스트',
                                hiringOrganization: { name: '테스트사' },
                                url: 'https://www.jobplanet.co.kr/job/1234',
                                jobLocation: { address: { addressRegion: '서울' } },
                            })}</script>
                        </head>
                    </html>
                `,
                    'text/html'
                );
                expect(parser.parse(doc).educationType).toBe(EducationType.UNKNOWN);
            });
        });
    });
});
