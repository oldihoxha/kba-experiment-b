import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Exam, ExamInput } from '../../../types/exam';
import { formatDate } from '../../../utils/date';
import {
  MODULE_MAX_LENGTH,
  validateExamForm,
  type ExamFormErrors,
  type ExamFormField,
  type ExamFormValues,
} from '../../../utils/validation';
import { Button } from '../../ui/Button/Button';
import { TextField } from '../../ui/TextField/TextField';
import styles from './ExamForm.module.css';

interface ExamFormProps {
  /** Vorhandene Klausur beim Bearbeiten, sonst leer. */
  exam?: Exam;
  onSubmit: (input: ExamInput) => void;
  onCancel: () => void;
}

const FIELD_ORDER: ExamFormField[] = ['module', 'date', 'time', 'credits'];

function initialValues(exam?: Exam): ExamFormValues {
  return {
    module: exam?.module ?? '',
    date: exam ? formatDate(exam.date) : '',
    time: exam?.time ?? '',
    room: exam?.room ?? '',
    credits: exam?.credits != null ? String(exam.credits) : '',
  };
}

export function ExamForm({ exam, onSubmit, onCancel }: ExamFormProps) {
  const [values, setValues] = useState<ExamFormValues>(() => initialValues(exam));
  const [errors, setErrors] = useState<ExamFormErrors>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const moduleInput = useRef<HTMLInputElement>(null);
  const dateInput = useRef<HTMLInputElement>(null);
  const timeInput = useRef<HTMLInputElement>(null);
  const creditsInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  const change = (field: keyof ExamFormValues) => (event: { target: { value: string } }) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = validateExamForm(values);
    setErrors(result.errors);
    if (result.input) {
      onSubmit(result.input);
      return;
    }
    const firstInvalid = FIELD_ORDER.find((field) => result.errors[field]);
    const inputs = { module: moduleInput, date: dateInput, time: timeInput, credits: creditsInput };
    if (firstInvalid) inputs[firstInvalid].current?.focus();
  };

  return (
    <section className={styles.wrapper} aria-labelledby="exam-form-title">
      <h2 id="exam-form-title" ref={heading} tabIndex={-1} className={styles.title}>
        {exam ? 'Klausur bearbeiten' : 'Neue Klausur anlegen'}
      </h2>
      <form className={styles.form} onSubmit={submit} noValidate>
        <TextField
          ref={moduleInput}
          label="Modulname"
          required
          placeholder="z. B. Datenbanksysteme"
          autoComplete="off"
          maxLength={MODULE_MAX_LENGTH + 20}
          value={values.module}
          error={errors.module}
          onChange={change('module')}
        />
        <div className={styles.pair}>
          <TextField
            ref={dateInput}
            label="Datum"
            required
            hint="Format TT.MM.JJJJ"
            placeholder="12.02.2027"
            inputMode="numeric"
            autoComplete="off"
            value={values.date}
            error={errors.date}
            onChange={change('date')}
          />
          <TextField
            ref={timeInput}
            label="Uhrzeit"
            hint="Optional"
            type="time"
            value={values.time}
            error={errors.time}
            onChange={change('time')}
          />
        </div>
        <div className={styles.pair}>
          <TextField
            label="Raum"
            hint="Optional"
            placeholder="z. B. A 104"
            autoComplete="off"
            maxLength={40}
            value={values.room}
            onChange={change('room')}
          />
          <TextField
            ref={creditsInput}
            label="Leistungspunkte"
            hint="Optional, 1 bis 30"
            placeholder="5"
            inputMode="numeric"
            autoComplete="off"
            value={values.credits}
            error={errors.credits}
            onChange={change('credits')}
          />
        </div>
        <div className={styles.actions}>
          <Button type="submit" variant="primary">
            Klausur speichern
          </Button>
          <Button onClick={onCancel}>Abbrechen</Button>
        </div>
      </form>
    </section>
  );
}
