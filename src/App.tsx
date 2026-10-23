import { useState } from 'react';
import { useExams } from './hooks/useExams';
import { AppShell } from './components/layout/AppShell/AppShell';
import { ExamList } from './components/exams/ExamList/ExamList';
import { ExamDetail } from './components/exams/ExamDetail/ExamDetail';
import { ExamForm } from './components/exams/ExamForm/ExamForm';
import { Button } from './components/ui/Button/Button';
import styles from './App.module.css';

type View = { kind: 'list' } | { kind: 'detail'; id: string } | { kind: 'form'; id: string | null };

export function App() {
  const store = useExams();
  const [view, setView] = useState<View>({ kind: 'list' });

  const examId = view.kind === 'list' ? null : view.id;
  const exam = examId ? store.getExam(examId) : undefined;
  const showForm = view.kind === 'form' && (view.id === null || exam !== undefined);
  const showDetail = view.kind === 'detail' && exam !== undefined;
  const paneOpen = showForm || showDetail;

  const goList = () => setView({ kind: 'list' });
  const openDetail = (id: string) => setView({ kind: 'detail', id });

  const notice = store.saveFailed && (
    <p className={styles.notice} role="alert">
      Dein Browser lässt gerade kein Speichern zu. Änderungen gehen beim Neuladen verloren.
    </p>
  );

  const createButton = !showForm && store.exams.length > 0 && (
    <Button variant="primary" icon="plus" onClick={() => setView({ kind: 'form', id: null })}>
      Klausur anlegen
    </Button>
  );

  return (
    <AppShell action={createButton || undefined} notice={notice || undefined}>
      <div className={styles.layout}>
        <div className={paneOpen ? styles.listHidden : styles.list}>
          <ExamList
            upcoming={store.upcoming}
            past={store.past}
            selectedId={examId}
            onOpen={openDetail}
            onCreate={() => setView({ kind: 'form', id: null })}
          />
        </div>
        <div className={paneOpen ? styles.pane : styles.paneHidden}>
          {showForm && (
            <ExamForm
              key={view.kind === 'form' ? (view.id ?? 'new') : 'new'}
              exam={exam}
              onCancel={() => (exam ? openDetail(exam.id) : goList())}
              onSubmit={(input) => {
                if (exam) {
                  store.updateExam(exam.id, input);
                  openDetail(exam.id);
                } else {
                  openDetail(store.addExam(input));
                }
              }}
            />
          )}
          {showDetail && exam && (
            <ExamDetail
              exam={exam}
              onBack={goList}
              onEdit={() => setView({ kind: 'form', id: exam.id })}
              onDelete={() => {
                store.deleteExam(exam.id);
                goList();
              }}
              onAddTopic={(title) => store.addTopic(exam.id, title)}
              onRenameTopic={(topicId, title) => store.renameTopic(exam.id, topicId, title)}
              onDeleteTopic={(topicId) => store.deleteTopic(exam.id, topicId)}
              onToggleTopic={(topicId) => store.toggleTopic(exam.id, topicId)}
            />
          )}
          {!paneOpen && store.exams.length > 0 && (
            <p className={styles.placeholder}>
              Wähle links eine Klausur aus, um ihre Lernthemen und deinen Fortschritt zu sehen.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
