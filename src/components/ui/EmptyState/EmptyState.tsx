import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  description: string;
  headingLevel?: 2 | 3;
  children?: ReactNode;
}

export function EmptyState({ title, description, headingLevel = 2, children }: EmptyStateProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <div className={styles.empty}>
      <div className={styles.mark} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <Heading className={styles.title}>{title}</Heading>
      <p className={styles.description}>{description}</p>
      {children}
    </div>
  );
}
