import parserFactory from '@/utils/parser/ParserFactory';
import { describe, it, expect } from 'vitest';
import ParserHelper from '../helper/parser-helper';

describe('ParserFactory', () => {
    it('잡코리아 문서를 올바른 파서로 처리한다', () => {
        const result = parserFactory.parse(ParserHelper.makeJobKoreaDoc());
        expect(result.company).toBe('잡코리아주식회사');
    });

    it('잡플래닛 문서를 올바른 파서로 처리한다', () => {
        const result = parserFactory.parse(ParserHelper.makeJobPlanetDoc());
        expect(result.company).toBe('잡플래닛주식회사');
    });

    it('원티드 문서를 올바른 파서로 처리한다', () => {
        const result = parserFactory.parse(ParserHelper.makeWantedDoc());
        expect(result.company).toBe('원티드랩');
    });

    it('지원하지 않는 플랫폼이면 에러를 던진다', () => {
        const doc = new DOMParser().parseFromString(
            `
            <html>
                <head>
                    <meta property="og:url" content="https://www.unknown-site.com/job/1" />
                </head>
            </html>
        `,
            'text/html'
        );
        expect(() => parserFactory.parse(doc)).toThrow('지원하지 않는 플랫폼');
    });
});
