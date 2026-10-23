import type { Exam } from '../../../types/exam';
import { daysUntil, formatDate, formatWeekday, isUrgent } from '../../../utils/date';
import { nextOpenTopic, progressOf } from '../../../utils/progress';
import { Button } from '../../ui/Button/Button';
import { Icon } from '../../ui/Icon/Icon';
import { ProgressBar } from '../../ui/ProgressBar/ProgressBar';
import { VisuallyHidden } from '../../ui/VisuallyHidden/VisuallyHidden';
import styles from './NextExamHero.module.css';

interface NextExamHeroProps {
  exam: Exam;
  onOpen: (id: string) => void;
}

function Countdown({ days }: { days: number }) {
  if (days === 0) {
    return <p className={styles.countWord}>Heute</p>;
  }
  return (
    <p className={styles.count}>
      <VisuallyHidden>Noch </VisuallyHidden>
      <span className={styles.number}>{days}</span>
      <span className={styles.unit}>{days === 1 ? 'Tag' : 'Tage'}</span>
    </p>
  );
}

export function NextExamHero({ exam, onOpen }: NextExamHeroProps) {
  const days = daysUntil(exam.date);
  const progress = progressOf(exam);
  const nextTopic = nextOpenTopic(exam);

  return (
    <section className={styles.hero} aria-labelledby={`hero-${exam.id}`}>
      <Countdown days={days} />
      <div className={styles.body}>
        {isUrgent(days) && (
          <p className={styles.urgent}>
            <Icon name="clock" />
            In weniger als einer Woche
          </p>
        )}
        <h2 id={`hero-${exam.id}`} className={styles.module}>
          {exam.module}
        </h2>
        <p className={styles.when}>
          <span>
            {formatWeekday(exam.date)}, {formatDate(exam.date)}
          </span>
          {exam.time && <span>{exam.time} Uhr</span>}
          {exam.room && <span>Raum {exam.room}</span>}
        </p>
        <div className={styles.progress}>
          <ProgressBar
            value={progress.percent}
            steps={{ done: progress.done, total: progress.total }}
            label={`Lernfortschritt ${exam.module}: ${progress.done} von ${progress.total} Themen erledigt`}
          />
        </div>
        <p className={styles.next}>
          {progress.total === 0
            ? 'Noch keine Lernthemen. Leg das erste Thema an.'
            : nextTopic
              ? `Als Nächstes lernen: ${nextTopic.title}`
              : 'Alle Themen erledigt. Gut gemacht!'}
        </p>
        <Button variant="secondary" className={styles.button} onClick={() => onOpen(exam.id)}>
          {progress.total === 0 ? 'Themen anlegen' : 'Themen ansehen'}
        </Button>
      </div>
    </section>
  );
}
