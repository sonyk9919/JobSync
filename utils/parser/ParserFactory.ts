import AbstractParser from "./AbstractParser";
import JobKoreaParser from "./platform/JobKoreaParser";
import { ParsedJob } from "./types";

class ParserFactory {
    private parsers: AbstractParser[] = [
        new JobKoreaParser(),
    ];

    public parse(document: Document): ParsedJob {
        const parser = this.parsers.find(parser => parser.isSupport(document));
        if (!parser) throw new Error("지원하지 않는 플랫폼입니다.");
        return parser.parse(document);
    }
}

const parserFactory = new ParserFactory();

export default parserFactory;