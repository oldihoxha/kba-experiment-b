import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Exam, ExamInput, Topic } from '../types/exam';
import { loadExams, saveExams } from '../services/storage';
import { compareExams, daysUntil } from '../utils/date';

export interface UseExams {
  exams: Exam[];
  /** Heute oder später, chronologisch. */
  upcoming: Exam[];
  /** Vor heute, die jüngste zuerst. */
  past: Exam[];
  saveFailed: boolean;
  getExam: (id: string) => Exam | undefined;
  addExam: (input: ExamInput) => string;
  updateExam: (id: string, input: ExamInput) => void;
  deleteExam: (id: string) => void;
  addTopic: (examId: string, title: string) => void;
  renameTopic: (examId: string, topicId: string, title: string) => void;
  deleteTopic: (examId: string, topicId: string) => void;
  toggleTopic: (examId: string, topicId: string) => void;
}

function createId(): string {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapTopics(exam: Exam, topicId: string, change: (topic: Topic) => Topic | null): Exam {
  return {
    ...exam,
    topics: exam.topics.flatMap((topic) => {
      if (topic.id !== topicId) return [topic];
      const next = change(topic);
      return next ? [next] : [];
    }),
  };
}

export function useExams(): UseExams {
  const [exams, setExams] = useState<Exam[]>(loadExams);
  const [saveFailed, setSaveFailed] = useState(false);
  const [today, setToday] = useState(() => new Date().toDateString());
  const latest = useRef(exams);

  // Tageswechsel erkennen, wenn die App im Hintergrund offen blieb.
  useEffect(() => {
    const refresh = () => setToday(new Date().toDateString());
    document.addEventListener('visibilitychange', refresh);
    return () => document.removeEventListener('visibilitychange', refresh);
  }, []);

  const commit = useCallback((change: (current: Exam[]) => Exam[]) => {
    const next = change(latest.current);
    latest.current = next;
    setExams(next);
    setSaveFailed(!saveExams(next));
  }, []);

  const { upcoming, past } = useMemo(() => {
    const sorted = [...exams].sort(compareExams);
    const isPast = (exam: Exam) => daysUntil(exam.date) < 0;
    return {
      upcoming: sorted.filter((exam) => !isPast(exam)),
      past: sorted.filter(isPast).reverse(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `today` löst die Neuberechnung nach Mitternacht aus
  }, [exams, today]);

  const updateExamById = useCallback(
    (id: string, change: (exam: Exam) => Exam) =>
      commit((current) => current.map((exam) => (exam.id === id ? change(exam) : exam))),
    [commit],
  );

  return {
    exams,
    upcoming,
    past,
    saveFailed,
    getExam: (id) => exams.find((exam) => exam.id === id),
    addExam: (input) => {
      const id = createId();
      commit((current) => [...current, { ...input, id, topics: [] }]);
      return id;
    },
    updateExam: (id, input) => updateExamById(id, (exam) => ({ ...exam, ...input })),
    deleteExam: (id) => commit((current) => current.filter((exam) => exam.id !== id)),
    addTopic: (examId, title) =>
      updateExamById(examId, (exam) => ({
        ...exam,
        topics: [...exam.topics, { id: createId(), title: title.trim(), done: false }],
      })),
    renameTopic: (examId, topicId, title) =>
      updateExamById(examId, (exam) =>
        mapTopics(exam, topicId, (topic) => ({ ...topic, title: title.trim() })),
      ),
    deleteTopic: (examId, topicId) =>
      updateExamById(examId, (exam) => mapTopics(exam, topicId, () => null)),
    toggleTopic: (examId, topicId) =>
      updateExamById(examId, (exam) =>
        mapTopics(exam, topicId, (topic) => ({ ...topic, done: !topic.done })),
      ),
  };
}
