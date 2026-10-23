import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';
import styles from './TextField.module.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, hideLabel = false, required = false, className, ...rest },
  ref,
) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ');

  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label htmlFor={id} className={hideLabel ? styles.labelHidden : styles.label}>
        {label}
        {required && <span className={styles.optionalMark}> (Pflichtfeld)</span>}
      </label>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={id}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        aria-required={required || undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          <Icon name="alert" />
          <VisuallyHidden>Fehler: </VisuallyHidden>
          {error}
        </p>
      )}
    </div>
  );
});
