import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0 bis 100
  label: string; // für Screenreader
  /** Optional: ein Segment pro Lernthema (Lernstreifen). */
  steps?: { done: number; total: number };
}

export function ProgressBar({ value, label, steps }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  const segments = steps ? Array.from({ length: steps.total }, (_, i) => i < steps.done) : [];

  return (
    <div className={styles.wrapper}>
      {steps && steps.total > 0 ? (
        <div
          className={styles.strip}
          role="progressbar"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          {segments.map((done, index) => (
            <span key={index} className={done ? styles.segmentDone : styles.segment} />
          ))}
        </div>
      ) : (
        <progress className={styles.native} max={100} value={percent} aria-label={label} />
      )}
      <span className={styles.value} aria-hidden="true">
        {percent} %
      </span>
    </div>
  );
}
