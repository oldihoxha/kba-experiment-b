# Klausurplan

Klausurplan zeigt Studierenden in der Prüfungsphase, welche Klausur als Nächstes ansteht, wie weit sie pro Klausur sind und woran sie als Nächstes lernen sollten. Studienprojekt der HTW Berlin (Modul „Komponentenbasierte Entwicklung“, Experiment B), keine offizielle Hochschulanwendung.

## Starten

```bash
npm install
npm run dev      # Entwicklungsserver
npm run build    # Typprüfung und Produktions-Build
npm run lint     # ESLint
npm run preview  # Produktions-Build lokal ansehen
```

Voraussetzung: Node.js ab Version 20. Alle Daten bleiben im `localStorage` des Browsers; es gibt kein Backend und keine Netzwerkanfragen.

## Funktionen

| | Funktion | Wo |
|---|---|---|
| F1 | Klausur anlegen (Modulname, Datum Pflicht; Uhrzeit, Raum, LP optional) | `ExamForm` |
| F2 | Bearbeiten, Löschen nach Bestätigung | `ExamForm`, `ExamDetail`, `Modal` |
| F3 | Chronologische Übersicht, nächste Klausur mit Countdown hervorgehoben | `ExamList`, `NextExamHero` |
| F4 | Vergangene Klausuren, eingeklappt | `ExamList` |
| F5 | Lernthemen hinzufügen, umbenennen, löschen, abhaken | `TopicList`, `TopicItem` |
| F6 | Fortschritt in Prozent und als Lernstreifen | `ProgressBar` |
| F7 | Detailansicht | `ExamDetail` |
| F8 | Persistenz | `services/storage.ts` |
| F9 | Validierung mit Fehlern am Feld | `utils/validation.ts`, `TextField` |
| F10 | Gestaltete leere Zustände | `EmptyState` |

## Architektur

```
src/
  types/exam.ts          Exam, Topic, ExamInput
  services/storage.ts    localStorage lesen/schreiben und prüfen, keine UI-Logik
  hooks/useExams.ts      zentraler Zustand und alle CRUD-Operationen
  utils/                 date (Countdown, Sortierung, Format), progress, validation
  components/
    layout/AppShell      Kopfzeile und Inhaltsbereich
    exams/               ExamList, ExamCard, NextExamHero, ExamForm, ExamDetail
    topics/              TopicList, TopicItem
    ui/                  ProgressBar, Button, Modal, EmptyState, TextField, Icon, VisuallyHidden
  styles/tokens.css      alle Design-Tokens (Farben, Schrift, Abstände, Dark Mode)
  styles/reset.css       minimaler Reset
  App.tsx                Ansichtssteuerung (Liste, Detail, Formular) per Zustand
```

Jede Komponente liegt in einem eigenen Ordner mit `.tsx` und `.module.css` und bleibt unter 150 Zeilen. Präsentationskomponenten bekommen nur typisierte Props. Zustand und Logik liegen in `useExams`, Persistenz ausschließlich in `services/storage.ts`.

## Wichtige Entscheidungen

- **Kein Router:** `App.tsx` hält eine einfache Ansicht (`list | detail | form`). Mobil ersetzt die Detailansicht die Liste, ab 1024 px stehen beide nebeneinander.
- **Speichern im Ereignis, nicht im Effekt:** `useExams` schreibt bei jeder Änderung direkt in den Speicher und meldet einen Fehlschlag (`saveFailed`) mit sichtbarem Hinweis. Fehlerhafte Daten im Speicher ergeben eine leere Liste statt eines Absturzes.
- **Datum als Text (TT.MM.JJJJ):** So gelten die Fehlermeldungen aus dem Auftrag, und ungültige Daten wie 31.02. werden erkannt. Intern wird ISO gespeichert.
- **Lernstreifen statt einfachem Balken:** ein Segment pro Thema. Ohne Segmente fällt `ProgressBar` auf `<progress>` zurück. Der Balken kommt ohne Inline-Styles aus.
- **Dringlichkeit** (weniger als 7 Tage): Uhr-Icon, Text und Orange, nie nur Farbe.
- **Farben:** Brandfarben nur als Flächen. Für Text sind dunklere (hell) bzw. hellere (dunkel) Abstufungen abgeleitet, alle ≥ 4,5 : 1. Details in [DESIGN.md](DESIGN.md).
- **Systemschrift:** keine Webfonts, weil die App keine Netzwerkanfragen stellen soll.
- **Modal:** eigene Fokusfalle, Escape schließt, Fokus kehrt zum Auslöser zurück. Der Fokus startet auf „Abbrechen“.
- **Entwicklungswerkzeuge:** `@vitejs/plugin-react` (Vite-Plugin für React), `typescript-eslint` und `eslint-plugin-react-hooks` sind nötig, damit ESLint TypeScript und Hooks versteht. Alle drei sind reine Dev-Abhängigkeiten. Zur Laufzeit gibt es nur React und React DOM.

## Geprüft

- `npm run build` und `npm run lint` ohne Fehler, TypeScript strict ohne `any`.
- Browser-Test aller Funktionen F1 bis F10, Fokusfalle und Escape im Modal, beschädigter Speicher.
- Lighthouse (Chrome, simulierte Drosselung): mobil Performance 100 / Accessibility 100, Desktop Performance 94 / Accessibility 100.
- Darstellung bei 360, 768 und 1440 px, hell und dunkel.
