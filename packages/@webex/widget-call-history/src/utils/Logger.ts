/**
 *
 * @param error
 */
export function formatError(error: any) {
    if (!error) {
      return '';
    }
  
    if (error.stack) {
      return `fileName: '${error.fileName}', name: '${error.name}' lineNumber:${error.lineNumber} columnNumber:${error.columnNumber} message:'${error.message}'.`;
    }
  
    if (error.message) {
      return error.message;
    }
    return JSON.stringify(error);
  }
  
  /**
   *
   * @param text
   * @param leadingCharactersToKeep
   */
  export function concise(text = '', leadingCharactersToKeep = 32) {
    if (text.length > leadingCharactersToKeep) {
      return `${text.substring(0, leadingCharactersToKeep - 1)}...`;
    }
    return text;
    // return text ? (text.length > leadingCharactersToKeep ? text.substring(0, leadingCharactersToKeep - 1) + '...' : text) : '';
  }
  
  export default class Logger {
    static log(level: string, msg: string) {
      console.log(`${new Date().toISOString()} [${level}] ${msg}\n`);
    }
  
    static debug(msg: string) {
      Logger.log('debug', msg);
    }
  
    static info(msg: string) {
      Logger.log('info', msg);
    }
  
    static error(msg: string) {
      Logger.log('error', msg);
    }
  }
  