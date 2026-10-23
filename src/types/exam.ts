export interface Topic {
  id: string;
  title: string;
  done: boolean;
}

export interface Exam {
  id: string;
  module: string;
  /** ISO-Datum JJJJ-MM-TT */
  date: string;
  /** HH:MM oder leer, wenn keine Uhrzeit angegeben ist */
  time: string;
  room: string;
  credits: number | null;
  topics: Topic[];
}

export type ExamInput = Omit<Exam, 'id' | 'topics'>;
