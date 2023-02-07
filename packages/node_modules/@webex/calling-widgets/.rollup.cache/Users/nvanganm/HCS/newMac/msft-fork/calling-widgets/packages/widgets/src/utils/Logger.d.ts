/**
 *
 * @param error
 */
export declare function formatError(error: any): any;
/**
 *
 * @param text
 * @param leadingCharactersToKeep
 */
export declare function concise(text?: string, leadingCharactersToKeep?: number): string;
export default class Logger {
    static log(level: string, msg: string): void;
    static debug(msg: string): void;
    static info(msg: string): void;
    static error(msg: string): void;
}
//# sourceMappingURL=Logger.d.ts.map