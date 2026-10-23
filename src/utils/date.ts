import type { Exam } from '../types/exam';

const MS_PER_DAY = 86_400_000;
const URGENT_DAYS = 7;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function isoToLocalDate(iso: string): Date {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Wandelt TT.MM.JJJJ in JJJJ-MM-TT um; null, wenn das Datum ungültig ist. */
export function parseGermanDate(input: string): string | null {
  const match = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(input.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (year < 2000 || year > 2100) return null;
  const date = new Date(year, month - 1, day);
  const valid =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return valid ? `${year}-${pad(month)}-${pad(day)}` : null;
}

/** JJJJ-MM-TT → TT.MM.JJJJ */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export function formatWeekday(iso: string, style: 'short' | 'long' = 'long'): string {
  return isoToLocalDate(iso).toLocaleDateString('de-DE', { weekday: style });
}

export function formatDay(iso: string): string {
  return String(isoToLocalDate(iso).getDate());
}

export function formatMonthShort(iso: string): string {
  return isoToLocalDate(iso).toLocaleDateString('de-DE', { month: 'short' }).replace('.', '');
}

/** Ganze Tage von heute bis zum Datum; negativ für vergangene Termine. */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((isoToLocalDate(iso).getTime() - today.getTime()) / MS_PER_DAY);
}

export function isUrgent(days: number): boolean {
  return days >= 0 && days < URGENT_DAYS;
}

export function countdownLabel(days: number): string {
  if (days === 0) return 'Heute';
  if (days === 1) return 'Morgen';
  if (days > 1) return `Noch ${days} Tage`;
  if (days === -1) return 'Gestern';
  return `Vor ${-days} Tagen`;
}

export function compareExams(a: Exam, b: Exam): number {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1;
  return a.time.localeCompare(b.time);
}
