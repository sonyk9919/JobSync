import { ParsedJob } from "./types";

abstract class AbstractParser {
    public abstract isSupport(document: Document): boolean;
    public abstract parse(document: Document): ParsedJob;
}

export default AbstractParser;