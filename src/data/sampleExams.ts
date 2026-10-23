import type { ExamInput } from '../types/exam';

export interface SampleExam extends ExamInput {
  topics: string[];
}

/** Beispieldaten zum schnellen Ausprobieren; sie werden nur auf ausdrücklichen Wunsch geladen. */
export const SAMPLE_EXAMS: SampleExam[] = [
  {
    module: 'Investitionsrechnung',
    date: '2027-02-12',
    time: '09:00',
    room: 'C 625',
    credits: 5,
    topics: ['Kapitalwertmethode', 'Interner Zinsfuß', 'Annuitätenmethode', 'Amortisationsrechnung'],
  },
  {
    module: 'Datenbanksysteme',
    date: '2027-02-16',
    time: '13:00',
    room: 'A 104',
    credits: 5,
    topics: ['ER-Modellierung', 'Normalformen', 'SQL-Joins', 'Transaktionen'],
  },
  {
    module: 'Projektmanagement',
    date: '2027-02-20',
    time: '10:00',
    room: '',
    credits: 5,
    topics: ['Netzplantechnik', 'Scrum', 'Risikomanagement'],
  },
];
