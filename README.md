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
- **Beispieldaten:** Die App startet leer. Über „Beispieldaten laden“ (leerer Zustand oder Listenende, mit Rückfrage) werden die drei Beispielklausuren aus `src/data/sampleExams.ts` geladen und vorhandene Daten ersetzt.
- **Entwicklungswerkzeuge:** `@vitejs/plugin-react` (Vite-Plugin für React), `typescript-eslint` und `eslint-plugin-react-hooks` sind nötig, damit ESLint TypeScript und Hooks versteht. Alle drei sind reine Dev-Abhängigkeiten. Zur Laufzeit gibt es nur React und React DOM.

## Geprüft

- `npm run build` und `npm run lint` ohne Fehler, TypeScript strict ohne `any`.
- Browser-Test aller Funktionen F1 bis F10, Fokusfalle und Escape im Modal, beschädigter Speicher.
- Lighthouse (Chrome, simulierte Drosselung): mobil Performance 100 / Accessibility 100, Desktop Performance 94 / Accessibility 100.
- Darstellung bei 360, 768 und 1440 px, hell und dunkel.

## Verwendeter Prompt (angepasstes CRISPE)

Aufruf des Skills mit `/frontend-design`, danach der folgende Auftrag:

~~~text
# C – Context
Ich studiere Wirtschaftsinformatik an der HTW Berlin. Im Modul "Komponentenbasierte Entwicklung" untersuchen wir, wie sich die Qualität KI-generierter Anwendungen durch einen strukturierten Entwicklungsauftrag und den Einsatz eines Design-Skills verändert. Dieser Auftrag ist Experiment B: Dieselbe Anwendung wie in Experiment A wird in einem neuen, unabhängigen Repository mit gleichem Stack und gleichen Grundanforderungen gebaut, diesmal mit einem professionellen Auftrag und ohne Korrekturprompts.

Die Anwendung heißt "Klausurplan". Zielgruppe sind Bachelor-Studierende der HTW Berlin, die sich in der Prüfungsphase auf mehrere Klausuren gleichzeitig vorbereiten. Sie nutzen die App überwiegend mobil zwischen Vorlesungen und ergänzend am Laptop, haben keine technischen Vorkenntnisse und stehen unter Zeitdruck. Die Bedienung muss ohne Erklärung verständlich sein.

# R – Role
Du arbeitest als Senior Frontend Engineer und Softwarearchitekt mit Schwerpunkt auf komponentenbasierter Architektur, Barrierefreiheit und wartbarem, typsicherem Code. Für die visuelle Gestaltung arbeitest du zusätzlich als Design-Lead und nutzt dafür ausdrücklich den Skill frontend-design. Du triffst technische und gestalterische Entscheidungen selbstständig, hältst dich strikt an diesen Auftrag und begründest wichtige Entscheidungen kurz in der Dokumentation.

# I – Instruction
Entwickle die vollständige, lauffähige Anwendung "Klausurplan".

Warum: Studierende verlieren in der Prüfungsphase schnell den Überblick, welche Klausur als Nächstes ansteht und wie weit sie mit dem Lernen sind. Die App soll genau diesen Überblick schaffen und Ruhe statt zusätzlichen Stress vermitteln.

Erfolg bedeutet: Nach einer kurzen Sitzung weiß der Nutzer, welche Klausur als Nächstes kommt, wie weit er pro Klausur ist und woran er als Nächstes lernen sollte.

Funktionale Anforderungen:
F1  Klausur anlegen mit Modulname (Pflicht), Datum (Pflicht), Uhrzeit, Raum und Leistungspunkten (optional).
F2  Klausuren bearbeiten und löschen, Löschen nur nach Bestätigung.
F3  Übersicht chronologisch sortiert; die nächste anstehende Klausur ist hervorgehoben und zeigt einen Countdown in Tagen.
F4  Vergangene Klausuren in einem separaten, standardmäßig eingeklappten Bereich.
F5  Lernthemen pro Klausur hinzufügen, umbenennen, löschen und als erledigt markieren.
F6  Lernfortschritt pro Klausur als Prozentwert und Fortschrittsbalken (erledigte / alle Themen).
F7  Detailansicht pro Klausur mit allen Angaben und der Themenliste.
F8  Alle Daten bleiben nach Neuladen erhalten (localStorage).
F9  Validierung: Pflichtfelder, kein leerer Modulname, gültiges Datum; Fehlermeldungen direkt am betroffenen Feld.
F10 Gestaltete leere Zustände: ohne Klausuren ein Hinweis mit Button zum Anlegen der ersten Klausur, ohne Themen ein entsprechender Hinweis in der Detailansicht.

Vorgehen beim Design (Skill frontend-design):
1. Erstelle zuerst einen kompakten Designplan (Farben, Schriften mit Rollen, Layout-Konzept mit ASCII-Skizze, Gestaltungsprinzipien) und lege ihn als DESIGN.md ab.
2. Prüfe den Plan gegen diesen Auftrag, überarbeite alles Generische und dokumentiere Änderungen und Begründung in DESIGN.md.
3. Setze erst danach den Code um und prüfe das Ergebnis selbstkritisch.

# S – Specification
Technologiestack (verbindlich):
- React 18 mit TypeScript im strict-Modus
- Vite als Build-Tool
- CSS Modules, globale Design-Tokens als CSS Custom Properties
- Datenhaltung ausschließlich über localStorage
- Keine weiteren Laufzeit-Abhängigkeiten

Komponentenstruktur:
src/
  types/exam.ts                Typdefinitionen (Exam, Topic)
  services/storage.ts          Lesen/Schreiben in localStorage, keine UI-Logik
  hooks/useExams.ts            Zentraler Zustand und alle CRUD-Operationen
  utils/date.ts                Countdown, Sortierung, Formatierung
  components/
    layout/AppShell            Grundlayout mit Header und Inhaltsbereich
    exams/ExamList             Liste, aufgeteilt in anstehend/vergangen
    exams/ExamCard             Einzelne Klausur in der Liste
    exams/NextExamHero         Hervorgehobene nächste Klausur mit Countdown
    exams/ExamForm             Anlegen und Bearbeiten
    exams/ExamDetail           Detailansicht
    topics/TopicList           Liste der Lernthemen
    topics/TopicItem           Einzelnes Thema
    ui/ProgressBar, ui/Button, ui/Modal, ui/EmptyState   Wiederverwendbare Bausteine
  styles/tokens.css            Alle Design-Tokens
  App.tsx

Architekturregeln:
- Jede Komponente hat genau eine Verantwortung und liegt in einem eigenen Ordner mit .tsx- und .module.css-Datei.
- Präsentationskomponenten erhalten Daten nur über typisierte Props, ohne Datenzugriffe.
- Zustand und Logik in useExams, Persistenz ausschließlich in services/storage.ts.
- Keine Komponente über 150 Zeilen.

Farben (verbindlich, offizielle HTW-Berlin-Markenfarben):
- Primärfarbe HTW-Grün #76B900: Hausfarbe, für die prägenden Elemente (nächste Klausur, Fortschritt, primäre Aktionen).
- Sekundärfarbe HTW-Blau #0082D1: für Links, Fokuszustände und informative Hinweise.
- Sekundärfarbe HTW-Orange #FF5F00: ausschließlich für Dringlichkeit (Klausur in weniger als 7 Tagen) und Warnungen.
- Ergänzend nur Schwarz, Weiß und Grautöne. Keine weiteren Farben.
- Das Grün erreicht auf Weiß keinen ausreichenden Kontrast für Text. Nutze es für Flächen, Balken und Akzente; leite für Text auf hellem Grund eine dunklere Abstufung desselben Farbtons ab, die WCAG AA erfüllt. Dasselbe gilt für Orange.
- Leite für den Dark Mode passende Abstufungen ab. Alle Werte als CSS-Variablen in tokens.css.
- Kein HTW-Logo, keine Bild-Wort-Marke; die App ist ein Studienprojekt und keine offizielle Hochschulanwendung.

Weitere Design- und UX-Vorgaben:
- Typografie, Layout und das prägende Gestaltungselement wählt der Skill frontend-design passend zum Thema.
- Mobile-first ab 360 px, Breakpoints bei 768 px und 1024 px; auf großen Bildschirmen Liste und Detailansicht nebeneinander.
- Dringlichkeit nie nur über Farbe, sondern zusätzlich über Text oder Icon.
- Sichtbare Fokuszustände, Touch-Ziele mindestens 44 × 44 px.
- Bewegung nur als Reaktion auf Nutzeraktionen, deaktiviert bei prefers-reduced-motion.
- Helles und dunkles Farbschema über prefers-color-scheme.

Ton und Sprache der Oberfläche:
- Deutsch, Datumsformat TT.MM.JJJJ.
- Klar, ruhig, ermutigend, aber sachlich. Duzen.
- Buttons beschreiben genau, was passiert ("Klausur speichern", nicht "Absenden").
- Fehlermeldungen sagen, was falsch ist und wie man es behebt.

Lieferumfang:
- Vollständiger, lauffähiger Quellcode im Repository
- README.md mit Kurzbeschreibung, Startanleitung, Überblick über die Komponentenarchitektur und Begründung der wichtigsten Entscheidungen
- DESIGN.md mit Designplan, Überprüfung und Überarbeitungen
- Abschließende Zusammenfassung im Chat, welche Abnahmekriterien erfüllt sind

# P – Performance
Abnahmekriterien:
- npm install && npm run dev startet die App ohne Fehler
- npm run build und npm run lint laufen fehlerfrei
- F1 bis F10 funktionieren nachweislich
- Korrekte Darstellung bei 360 px, 768 px und 1440 px Breite
- Vollständige Bedienung ohne Maus
- Komponentenstruktur wie vorgegeben umgesetzt
- README.md und DESIGN.md liegen vollständig vor

Qualitätsstandards:
- WCAG 2.1 AA: semantisches HTML, beschriftete Formularfelder, ausreichende Kontraste, Fokusfalle im Modal mit Schließen per Escape
- TypeScript strict ohne Fehler, keine Verwendung von any
- Lighthouse Performance und Accessibility jeweils mindestens 90
- Fehlerhafte oder fehlende Daten in localStorage führen zu einem leeren Ausgangszustand, nicht zum Absturz

Zu vermeiden:
- Backend, externe APIs, Netzwerkanfragen
- Zusätzliche npm-Pakete außer React, React DOM, TypeScript, Vite, ESLint und deren Typdefinitionen
- Routing-Bibliotheken; Ansichtssteuerung über den Anwendungszustand
- Inline-Styles und globale Klassen außerhalb von tokens.css und einem minimalen Reset
- Lorem ipsum, TODO-Kommentare, unfertige Funktionen
- Generische KI-Optik: identische abgerundete Karten mit grauem Schatten überall, Großbuchstaben-Labels über jeder Überschrift, Pfeile hinter Button-Texten, Einblend-Animationen auf jedem Abschnitt

# E – Example
Beispieldaten, mit denen die App beim ersten Start NICHT befüllt wird, die aber zeigen, welche Inhalte realistisch sind und zum Testen dienen:
- Investitionsrechnung, 12.02.2027, 09:00, Raum C 625, 5 LP – Themen: Kapitalwertmethode, Interner Zinsfuß, Annuitätenmethode, Amortisationsrechnung
- Datenbanksysteme, 16.02.2027, 13:00, Raum A 104, 5 LP – Themen: ER-Modellierung, Normalformen, SQL-Joins, Transaktionen
- Projektmanagement, 20.02.2027, 10:00, 5 LP – Themen: Netzplantechnik, Scrum, Risikomanagement

Beispiele für gute Oberflächentexte:
- Leerer Zustand: "Noch keine Klausuren eingetragen. Leg deine erste Klausur an, um deinen Lernplan zu starten." + Button "Erste Klausur anlegen"
- Countdown: "Noch 6 Tage" mit Dringlichkeitsmarkierung
- Fehlermeldung: "Bitte gib ein Datum im Format TT.MM.JJJJ ein."
- Bestätigung: "Klausur „Datenbanksysteme“ wirklich löschen? Alle Lernthemen dazu werden ebenfalls entfernt." – Buttons "Löschen" und "Abbrechen"

Beispiel für den gewünschten Komponentenstil (Präsentationskomponente, nur typisierte Props, keine Logik):
interface ProgressBarProps {
  value: number;      // 0 bis 100
  label: string;      // für Screenreader
}

Arbeite alle Anforderungen vollständig und ohne Rückfragen ab. Prüfe vor Abschluss selbst jedes Abnahmekriterium, behebe gefundene Fehler und fasse am Ende zusammen, welche Kriterien erfüllt sind.
~~~
