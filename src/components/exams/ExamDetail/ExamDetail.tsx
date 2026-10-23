import { useEffect, useRef, useState } from 'react';
import type { Exam } from '../../../types/exam';
import { countdownLabel, daysUntil, formatDate, formatWeekday, isUrgent } from '../../../utils/date';
import { nextOpenTopic, progressOf } from '../../../utils/progress';
import { Button } from '../../ui/Button/Button';
import { Icon } from '../../ui/Icon/Icon';
import { Modal } from '../../ui/Modal/Modal';
import { ProgressBar } from '../../ui/ProgressBar/ProgressBar';
import { TopicList } from '../../topics/TopicList/TopicList';
import styles from './ExamDetail.module.css';

interface ExamDetailProps {
  exam: Exam;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddTopic: (title: string) => void;
  onRenameTopic: (topicId: string, title: string) => void;
  onDeleteTopic: (topicId: string) => void;
  onToggleTopic: (topicId: string) => void;
}

export function ExamDetail({
  exam,
  onBack,
  onEdit,
  onDelete,
  onAddTopic,
  onRenameTopic,
  onDeleteTopic,
  onToggleTopic,
}: ExamDetailProps) {
  const [confirming, setConfirming] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const days = daysUntil(exam.date);
  const progress = progressOf(exam);
  const nextTopic = nextOpenTopic(exam);

  useEffect(() => {
    heading.current?.focus();
  }, [exam.id]);

  return (
    <article className={styles.detail} aria-labelledby="exam-detail-title">
      <Button variant="quiet" icon="chevron-left" className={styles.back} onClick={onBack}>
        Zur Übersicht
      </Button>

      <header className={styles.header}>
        <h2 id="exam-detail-title" ref={heading} tabIndex={-1} className={styles.title}>
          {exam.module}
        </h2>
        <p className={isUrgent(days) ? styles.countdownUrgent : styles.countdown}>
          {isUrgent(days) && <Icon name="clock" />}
          {countdownLabel(days)}
        </p>
      </header>

      <dl className={styles.facts}>
        <div>
          <dt>Datum</dt>
          <dd>
            {formatWeekday(exam.date)}, {formatDate(exam.date)}
          </dd>
        </div>
        <div>
          <dt>Uhrzeit</dt>
          <dd>{exam.time ? `${exam.time} Uhr` : <span className={styles.none}>Nicht angegeben</span>}</dd>
        </div>
        <div>
          <dt>Raum</dt>
          <dd>{exam.room || <span className={styles.none}>Nicht angegeben</span>}</dd>
        </div>
        <div>
          <dt>Leistungspunkte</dt>
          <dd>
            {exam.credits !== null ? `${exam.credits} LP` : <span className={styles.none}>Nicht angegeben</span>}
          </dd>
        </div>
      </dl>

      <div className={styles.progress}>
        <ProgressBar
          value={progress.percent}
          steps={{ done: progress.done, total: progress.total }}
          label={`Lernfortschritt: ${progress.done} von ${progress.total} Themen erledigt`}
        />
        <p className={styles.progressText}>
          {progress.total === 0
            ? 'Noch keine Themen angelegt.'
            : `${progress.done} von ${progress.total} Themen erledigt`}
        </p>
      </div>

      <TopicList
        topics={exam.topics}
        nextTopicId={nextTopic?.id ?? null}
        onAdd={onAddTopic}
        onRename={onRenameTopic}
        onDelete={onDeleteTopic}
        onToggle={onToggleTopic}
      />

      <div className={styles.actions}>
        <Button icon="edit" onClick={onEdit}>
          Klausur bearbeiten
        </Button>
        <Button icon="trash" onClick={() => setConfirming(true)}>
          Klausur löschen
        </Button>
      </div>

      {confirming && (
        <Modal
          title="Klausur löschen?"
          onClose={() => setConfirming(false)}
          actions={
            <>
              <Button onClick={() => setConfirming(false)}>Abbrechen</Button>
              <Button variant="danger" onClick={onDelete}>
                Löschen
              </Button>
            </>
          }
        >
          <p>
            Klausur „{exam.module}“ wirklich löschen? Alle Lernthemen dazu werden ebenfalls entfernt.
          </p>
        </Modal>
      )}
    </article>
  );
}
