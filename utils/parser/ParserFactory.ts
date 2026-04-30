import AbstractParser from './AbstractParser';
import JobKoreaParser from './platform/JobKoreaParser';
import JobPlanetParser from './platform/JobPlanetParser';
import WantedParser from './platform/WantedParser';
import { ParsedJob } from './types';

class ParserFactory {
    private parsers: AbstractParser[] = [
        new JobKoreaParser(),
        new JobPlanetParser(),
        new WantedParser(),
    ];

    public parse(document: Document): ParsedJob {
        const parser = this.parsers.find((parser) => parser.isSupport(document));
        if (!parser)
            throw new Error('지원하지 않는 플랫폼이에요. (잡코리아, 잡플래닛, 원티드만 지원해요.)');
        return parser.parse(document);
    }
}

const parserFactory = new ParserFactory();

export default parserFactory;
