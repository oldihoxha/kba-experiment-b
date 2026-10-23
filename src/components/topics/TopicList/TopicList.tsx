import { useState, type FormEvent } from 'react';
import type { Topic } from '../../../types/exam';
import { Button } from '../../ui/Button/Button';
import { EmptyState } from '../../ui/EmptyState/EmptyState';
import { TextField } from '../../ui/TextField/TextField';
import { TopicItem } from '../TopicItem/TopicItem';
import styles from './TopicList.module.css';

interface TopicListProps {
  topics: Topic[];
  nextTopicId: string | null;
  onAdd: (title: string) => void;
  onRename: (topicId: string, title: string) => void;
  onDelete: (topicId: string) => void;
  onToggle: (topicId: string) => void;
}

export function TopicList({ topics, nextTopicId, onAdd, onRename, onDelete, onToggle }: TopicListProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (title.trim() === '') {
      setError('Bitte gib einen Namen für das Thema ein, zum Beispiel „Kapitalwertmethode“.');
      return;
    }
    onAdd(title);
    setTitle('');
    setError('');
  };

  return (
    <section className={styles.section} aria-labelledby="lernthemen">
      <h3 id="lernthemen" className={styles.heading}>
        Lernthemen
      </h3>
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField
          className={styles.input}
          label="Neues Lernthema"
          placeholder="z. B. Kapitalwertmethode"
          value={title}
          error={error}
          maxLength={120}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
        />
        <Button type="submit" variant="primary" icon="plus">
          Thema hinzufügen
        </Button>
      </form>
      {topics.length === 0 ? (
        <EmptyState
          headingLevel={3}
          title="Noch keine Lernthemen."
          description="Trag oben ein, was du für diese Klausur lernen willst, etwa einzelne Kapitel. Mit jedem erledigten Thema wächst dein Lernstreifen."
        />
      ) : (
        <ul className={styles.list}>
          {topics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              isNext={topic.id === nextTopicId}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
