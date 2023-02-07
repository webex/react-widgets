/**
 * @description Handle formatting the time for display.
 * @param {string} date The date string to format
 * @returns {string} A formatted time as in 3:00 PM
 */
export declare function formatTime(date: string): string;
/**
 * @description Handle formatting the date for display.
 * @param {string} date The date string to format
 * @returns {string} A formatted date as in "Today", "Yesterday", or "1/1/22"
 */
export declare function formatDate(date: string): string | null;
/**
 * @description Handle formatting the duration for display.
 * @param {number} seconds Total duration in seconds
 * @returns {string} A formatted duration for display "04:10"
 */
export declare function formatDuration(seconds: number): string;
/**
 * @description Handle formatting the duration for display.
 * @param {string} d1 The start time date string
 * @param {string} d2 The end time date string
 * @returns {string} A formatted duration for display "4m 10s"
 */
export declare function formatDurationFromDates(d1: string, d2: string): string;
//# sourceMappingURL=dateUtils.d.ts.map