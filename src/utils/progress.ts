import type { Exam, Topic } from '../types/exam';

export interface Progress {
  done: number;
  total: number;
  percent: number;
}

export function progressOf(exam: Exam): Progress {
  const total = exam.topics.length;
  const done = exam.topics.filter((topic) => topic.done).length;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** Das erste noch nicht erledigte Thema, an dem als Nächstes gelernt werden sollte. */
export function nextOpenTopic(exam: Exam): Topic | undefined {
  return exam.topics.find((topic) => !topic.done);
}
