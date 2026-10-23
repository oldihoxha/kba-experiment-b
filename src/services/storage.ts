import type { Exam, Topic } from '../types/exam';

const STORAGE_KEY = 'klausurplan.exams.v1';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTopic(value: unknown): value is Topic {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.done === 'boolean'
  );
}

function isExam(value: unknown): value is Exam {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.module === 'string' &&
    typeof value.date === 'string' &&
    ISO_DATE.test(value.date) &&
    typeof value.time === 'string' &&
    typeof value.room === 'string' &&
    (value.credits === null || typeof value.credits === 'number') &&
    Array.isArray(value.topics) &&
    value.topics.every(isTopic)
  );
}

/** Liest die Klausuren. Fehlende oder fehlerhafte Daten ergeben eine leere Liste. */
export function loadExams(): Exam[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isExam) ? parsed : [];
  } catch {
    return [];
  }
}

/** Schreibt die Klausuren. Gibt false zurück, wenn der Speicher nicht beschreibbar ist. */
export function saveExams(exams: Exam[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exams));
    return true;
  } catch {
    return false;
  }
}
