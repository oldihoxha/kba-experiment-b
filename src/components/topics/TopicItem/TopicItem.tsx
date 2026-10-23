import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import type { Topic } from '../../../types/exam';
import { Button } from '../../ui/Button/Button';
import { TextField } from '../../ui/TextField/TextField';
import styles from './TopicItem.module.css';

interface TopicItemProps {
  topic: Topic;
  isNext: boolean;
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function TopicItem({ topic, isNext, onToggle, onRename, onDelete }: TopicItemProps) {
  const checkId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(topic.title);
  const [error, setError] = useState('');
  const editButton = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // Nach dem Bearbeiten den Fokus auf „Umbenennen“ zurückgeben.
  useEffect(() => {
    if (wasEditing.current && !editing) editButton.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const startEdit = () => {
    setDraft(topic.title);
    setError('');
    setEditing(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (draft.trim() === '') {
      setError('Bitte gib einen Namen für das Thema ein.');
      return;
    }
    onRename(topic.id, draft);
    setEditing(false);
  };

  const cancelOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setEditing(false);
  };

  if (editing) {
    return (
      <li className={styles.item}>
        <form className={styles.editForm} onSubmit={submit} onKeyDown={cancelOnEscape} noValidate>
          <TextField
            label={`Neuer Name für das Thema „${topic.title}“`}
            hideLabel
            autoFocus
            value={draft}
            error={error}
            maxLength={120}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className={styles.editActions}>
            <Button type="submit" variant="primary">
              Namen speichern
            </Button>
            <Button onClick={() => setEditing(false)}>Abbrechen</Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={styles.item}>
      <div className={styles.row}>
        <input
          id={checkId}
          type="checkbox"
          className={styles.check}
          checked={topic.done}
          onChange={() => onToggle(topic.id)}
        />
        <label htmlFor={checkId} className={styles.label}>
          <span className={topic.done ? styles.titleDone : styles.title}>{topic.title}</span>
          {isNext && <span className={styles.next}>Als Nächstes</span>}
        </label>
        <Button
          ref={editButton}
          variant="quiet"
          icon="edit"
          aria-label={`Thema „${topic.title}“ umbenennen`}
          onClick={startEdit}
        />
        <Button
          variant="quiet"
          icon="trash"
          aria-label={`Thema „${topic.title}“ löschen`}
          onClick={() => onDelete(topic.id)}
        />
      </div>
    </li>
  );
}
