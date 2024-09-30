import { DateTime, Duration } from 'luxon';

/**
 * @description Converts date string to DateTime object for use in other functions
 * @param {string} date The date string to format
 * @returns {DateTime} A DateTime object to be formatted
 */
function getDateTimeFromString(date: string): DateTime {
  return DateTime.fromISO(date);
}

/**
 * @description Handle formatting the time for display.
 * @param {string} date The date string to format
 * @returns {string} A formatted time as in 3:00 PM
 */
export function formatTime(date: string) {
  return getDateTimeFromString(date).toLocaleString({
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * @description Handle formatting the date for display.
 * @param {string} date The date string to format
 * @returns {string} A formatted date as in "Today", "Yesterday", or "1/1/22"
 */
export function formatDate(date: string) {
  const d = getDateTimeFromString(date);

  if (
    d.toISODate() === DateTime.now().toISODate() ||
    d.toISODate() === DateTime.now().minus({ day: 1 }).toISODate()
  ) {
    return d.toRelativeCalendar({});
  }

  return d.toLocaleString({
    day: 'numeric',
    month: 'numeric',
    year: '2-digit',
  });
}

/**
 * @description Handle formatting the duration for display.
 * @param {number} seconds Total duration in seconds
 * @returns {string} A formatted duration for display "04:10"
 */
export function formatDuration(seconds: number) {
  const dur = Duration.fromObject({ seconds: Math.trunc(seconds) });
  const shiftedDur = dur.shiftTo('hours', 'minutes', 'seconds').normalize();
  return shiftedDur.toFormat('hh:mm:ss');
}

/**
 * @description Handle formatting the duration for display.
 * @param {string} d1 The start time date string
 * @param {string} d2 The end time date string
 * @returns {string} A formatted duration for display "4m 10s"
 */
export function formatDurationFromDates(d1: string, d2: string) {
  const dur = getDateTimeFromString(d2).diff(getDateTimeFromString(d1));
  const entries = Object.entries(
    dur
      .shiftTo('hours', 'minutes', 'seconds', 'milliseconds')
      .normalize()
      .toObject()
  ).filter(([unit, amount]) => amount > 0 && unit !== 'milliseconds');
  const outputDur = Duration.fromObject(
    entries.length === 0 ? { seconds: 0 } : Object.fromEntries(entries)
  );
  return outputDur
    .toHuman({ listStyle: 'narrow', unitDisplay: 'narrow' })
    .replace(/,/g, '');
}

export function formatDurationFromSeconds(seconds: number) {
  const dur = Duration.fromObject({ seconds: Math.trunc(seconds) });
  const entries = Object.entries(
    dur
      .shiftTo('hours', 'minutes', 'seconds', 'milliseconds')
      .normalize()
      .toObject()
  ).filter(([unit, amount]) => amount > 0 && unit !== 'milliseconds');
  const outputDur = Duration.fromObject(
    entries.length === 0 ? { seconds: 0 } : Object.fromEntries(entries)
  );
  return outputDur
    .toHuman({ listStyle: 'narrow', unitDisplay: 'narrow' })
    .replace(/,/g, '');
}

/**
 * @description Handle formatting the time for display 24hour format is required.
 * @param {string} date The date string to format
 * @returns {string} A formatted time as in 24hr format
 */
export function formatTimeToSupport24Hours(date: string) {
  return getDateTimeFromString(date).toLocaleString({
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * @description Handle formatting the date for display.
 * @param {string} date The date string to format
 * @returns {string} A formatted date as in "Today", "Yesterday", or "dd.mm.yyyy"
 */
export function formatDateDDMMYYYY(date: string) {
  const d = getDateTimeFromString(date);

  if (
    d.toISODate() === DateTime.now().toISODate() ||
    d.toISODate() === DateTime.now().minus({ day: 1 }).toISODate()
  ) {
    return d.toRelativeCalendar({});
  }

  return d.toLocaleString({
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * @description Handle formatting the date for announce.
 * @param {string} date The date string to format
 * @returns {string} A announced date as in "Today", "Yesterday", or "june 10,2024"
 */
export const formatDateForAnnouncement = (date: string) => {
  const dateValue = getDateTimeFromString(date);
  
  if (
    dateValue.toISODate() === DateTime.now().toISODate() ||
    dateValue.toISODate() === DateTime.now().minus({ days: 1 }).toISODate()
  ) {
  return dateValue.toRelativeCalendar({});
  }
  
  return dateValue.toLocaleString({
    month: 'long', // Use 'long' for full month name
    day: 'numeric',
    year: 'numeric',
  });
  }
