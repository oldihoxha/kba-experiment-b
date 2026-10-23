import type { ExamInput } from '../types/exam';
import { parseGermanDate } from './date';

export interface ExamFormValues {
  module: string;
  date: string;
  time: string;
  room: string;
  credits: string;
}

export type ExamFormField = 'module' | 'date' | 'time' | 'credits';
export type ExamFormErrors = Partial<Record<ExamFormField, string>>;

export const MODULE_MAX_LENGTH = 80;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateExamForm(values: ExamFormValues): {
  errors: ExamFormErrors;
  input: ExamInput | null;
} {
  const errors: ExamFormErrors = {};
  const module = values.module.trim();
  const dateText = values.date.trim();
  const creditsText = values.credits.trim();

  if (module === '') {
    errors.module = 'Bitte gib den Namen des Moduls ein.';
  } else if (module.length > MODULE_MAX_LENGTH) {
    errors.module = `Der Modulname darf höchstens ${MODULE_MAX_LENGTH} Zeichen lang sein.`;
  }

  const isoDate = dateText === '' ? null : parseGermanDate(dateText);
  if (dateText === '') {
    errors.date = 'Bitte gib das Datum der Klausur ein, zum Beispiel 12.02.2027.';
  } else if (isoDate === null) {
    errors.date = 'Bitte gib ein Datum im Format TT.MM.JJJJ ein.';
  }

  if (values.time !== '' && !TIME_PATTERN.test(values.time)) {
    errors.time = 'Bitte gib die Uhrzeit im Format HH:MM ein, zum Beispiel 09:00.';
  }

  let credits: number | null = null;
  if (creditsText !== '') {
    credits = /^\d{1,2}$/.test(creditsText) ? Number(creditsText) : NaN;
    if (Number.isNaN(credits) || credits < 1 || credits > 30) {
      errors.credits = 'Bitte gib die Leistungspunkte als ganze Zahl von 1 bis 30 ein.';
    }
  }

  if (Object.keys(errors).length > 0 || isoDate === null) return { errors, input: null };
  return {
    errors,
    input: { module, date: isoDate, time: values.time, room: values.room.trim(), credits },
  };
}
