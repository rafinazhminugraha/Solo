import { format, differenceInCalendarDays, parseISO } from 'date-fns';

/**
 * Returns the current date in 'yyyy-MM-dd' format using the device local timezone.
 */
export function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Checks if the provided date string matches today's date in local time.
 */
export function isToday(dateStr: string): boolean {
  return getTodayDateString() === dateStr;
}

/**
 * Computes the difference in calendar days between dateA and dateB (dateA - dateB).
 */
export function getDaysDifference(dateA: string, dateB: string): number {
  return differenceInCalendarDays(parseISO(dateA), parseISO(dateB));
}

/**
 * Checks if nextDate occurs exactly one calendar day after prevDate.
 */
export function isConsecutiveDay(prevDate: string, nextDate: string): boolean {
  return getDaysDifference(nextDate, prevDate) === 1;
}

/**
 * Formats a date string into a user-friendly readable format (e.g. 'May 18, 2026').
 */
export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}
