class ParserHelper {
    private static makeDocument(html: string): Document {
        return new DOMParser().parseFromString(html, 'text/html');
    }

    public static makeJobKoreaDoc(overrides: Record<string, unknown> = {}): Document {
        const ld = {
            '@type': 'JobPosting',
            title: '프론트엔드 개발자',
            validThrough: '2025-12-31',
            employmentType: 'FULL_TIME',
            experienceRequirements: '경력',
            educationRequirements: '대졸',
            hiringOrganization: { name: '잡코리아주식회사' },
            url: 'https://www.jobkorea.co.kr/recruit/1234',
            jobLocation: { address: { streetAddress: '서울 강남구' } },
            ...overrides,
        };
        return this.makeDocument(`
        <html>
            <head>
                <meta property="og:url" content="https://www.jobkorea.co.kr/recruit/1234" />
                <script type="application/ld+json">${JSON.stringify(ld)}</script>
            </head>
        </html>
    `);
    }

    public static makeJobPlanetDoc(overrides: Record<string, unknown> = {}): Document {
        const ld = {
            '@type': 'JobPosting',
            title: '백엔드 개발자',
            validThrough: '2025.11.30',
            employmentType: 'FULL_TIME',
            experienceRequirements: '신입·경력',
            hiringOrganization: { name: '잡플래닛주식회사' },
            url: 'https://www.jobplanet.co.kr/job/1234',
            jobLocation: { address: { addressRegion: '서울' } },
            ...overrides,
        };
        return this.makeDocument(`
        <html>
            <head>
                <meta property="og:url" content="https://www.jobplanet.co.kr/job/1234" />
                <script type="application/ld+json">${JSON.stringify(ld)}</script>
            </head>
            <body>"education_level_id":5</body>
        </html>
    `);
    }

    public static makeWantedDoc(overrides: Record<string, unknown> = {}): Document {
        const ld = {
            '@type': 'JobPosting',
            title: '풀스택 개발자',
            validThrough: '2025-10-31T00:00:00',
            employmentType: '정규직',
            experienceRequirements: ['신입', '경력'],
            hiringOrganization: { name: '원티드랩' },
            url: 'https://www.wanted.co.kr/wd/1234',
            jobLocation: { address: { addressRegion: '서울', addressLocality: '강남구' } },
            ...overrides,
        };
        return this.makeDocument(`
        <html>
            <head>
                <meta property="og:url" content="https://www.wanted.co.kr/wd/1234" />
                <script type="application/ld+json">${JSON.stringify(ld)}</script>
            </head>
        </html>
    `);
    }
}

export default ParserHelper;
