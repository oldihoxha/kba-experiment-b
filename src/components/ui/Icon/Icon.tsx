import type { ReactElement } from 'react';
import styles from './Icon.module.css';

export type IconName = 'edit' | 'trash' | 'clock' | 'chevron-left' | 'chevron-down' | 'plus' | 'alert';

interface IconProps {
  name: IconName;
}

const PATHS: Record<IconName, ReactElement> = {
  edit: <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />,
  trash: <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13M10 11v6M14 11v6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'chevron-left': <path d="M15 5l-7 7 7 7" />,
  'chevron-down': <path d="M5 9l7 7 7-7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  alert: (
    <>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v5M12 18v.01" />
    </>
  ),
};

/** Dekoratives Icon; die Bedeutung steht immer zusätzlich im Text oder im Namen des Buttons. */
export function Icon({ name }: IconProps) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
