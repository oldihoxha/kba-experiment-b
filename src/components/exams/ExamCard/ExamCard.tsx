import type { Exam } from '../../../types/exam';
import { countdownLabel, daysUntil, formatDay, formatMonthShort, formatWeekday, isUrgent } from '../../../utils/date';
import { progressOf } from '../../../utils/progress';
import { Icon } from '../../ui/Icon/Icon';
import { ProgressBar } from '../../ui/ProgressBar/ProgressBar';
import styles from './ExamCard.module.css';

interface ExamCardProps {
  exam: Exam;
  selected: boolean;
  onOpen: (id: string) => void;
}

export function ExamCard({ exam, selected, onOpen }: ExamCardProps) {
  const days = daysUntil(exam.date);
  const urgent = isUrgent(days);
  const progress = progressOf(exam);
  const details = [
    exam.time ? `${exam.time} Uhr` : '',
    exam.room ? `Raum ${exam.room}` : '',
    exam.credits !== null ? `${exam.credits} LP` : '',
  ].filter(Boolean);

  return (
    <li className={styles.item}>
      <button
        type="button"
        className={styles.row}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onOpen(exam.id)}
      >
        <span className={styles.date} aria-hidden="true">
          <span className={styles.weekday}>{formatWeekday(exam.date, 'short')}</span>
          <span className={styles.day}>{formatDay(exam.date)}</span>
          <span className={styles.month}>{formatMonthShort(exam.date)}</span>
        </span>
        <span className={styles.main}>
          <span className={styles.module}>{exam.module}</span>
          <span className={styles.meta}>
            <span className={urgent ? styles.urgent : undefined}>
              {urgent && <Icon name="clock" />}
              {countdownLabel(days)}
            </span>
            {details.map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
          </span>
          <ProgressBar
            value={progress.percent}
            steps={{ done: progress.done, total: progress.total }}
            label={`Lernfortschritt ${exam.module}: ${progress.done} von ${progress.total} Themen erledigt`}
          />
        </span>
      </button>
    </li>
  );
}
