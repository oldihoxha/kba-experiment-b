import { useId, useState } from 'react';
import type { Exam } from '../../../types/exam';
import { Button } from '../../ui/Button/Button';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { Icon } from '../../ui/Icon/Icon';
import { ExamCard } from '../ExamCard/ExamCard';
import { NextExamHero } from '../NextExamHero/NextExamHero';
import styles from './ExamList.module.css';

interface ExamListProps {
  upcoming: Exam[];
  past: Exam[];
  selectedId: string | null;
  onOpen: (id: string) => void;
  onCreate: () => void;
}

export function ExamList({ upcoming, past, selectedId, onOpen, onCreate }: ExamListProps) {
  const [showPast, setShowPast] = useState(false);
  const pastId = useId();
  const [next, ...later] = upcoming;

  if (!next && past.length === 0) {
    return (
      <EmptyState
        title="Noch keine Klausuren eingetragen."
        description="Leg deine erste Klausur an, um deinen Lernplan zu starten."
      >
        <Button variant="primary" icon="plus" onClick={onCreate}>
          Erste Klausur anlegen
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className={styles.list}>
      {next ? (
        <NextExamHero exam={next} onOpen={onOpen} />
      ) : (
        <EmptyState
          title="Keine Klausur in Sicht."
          description="Alle eingetragenen Klausuren liegen in der Vergangenheit. Leg eine neue an, wenn der nächste Termin feststeht."
        >
          <Button variant="primary" icon="plus" onClick={onCreate}>
            Klausur anlegen
          </Button>
        </EmptyState>
      )}

      {later.length > 0 && (
        <section aria-labelledby="weitere-klausuren">
          <h2 id="weitere-klausuren" className={styles.heading}>
            Danach
          </h2>
          <ul className={styles.rows}>
            {later.map((exam) => (
              <ExamCard key={exam.id} exam={exam} selected={exam.id === selectedId} onOpen={onOpen} />
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className={styles.heading}>
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={showPast}
              aria-controls={pastId}
              onClick={() => setShowPast((open) => !open)}
            >
              <span className={showPast ? styles.chevronOpen : styles.chevron}>
                <Icon name="chevron-down" />
              </span>
              Vergangene Klausuren ({past.length})
            </button>
          </h2>
          {showPast && (
            <ul id={pastId} className={styles.rows}>
              {past.map((exam) => (
                <ExamCard key={exam.id} exam={exam} selected={exam.id === selectedId} onOpen={onOpen} />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
