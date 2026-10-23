import type { ReactNode } from 'react';
import styles from './AppShell.module.css';

interface AppShellProps {
  action?: ReactNode;
  notice?: ReactNode;
  children: ReactNode;
}

export function AppShell({ action, notice, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#inhalt">
        Zum Inhalt springen
      </a>
      <header className={styles.header}>
        <div className={styles.bar}>
          <h1 className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Klausurplan
          </h1>
          {action}
        </div>
      </header>
      <main id="inhalt" className={styles.main} tabIndex={-1}>
        {notice}
        {children}
      </main>
    </div>
  );
}
