# DESIGN.md – Klausurplan

Gestaltung nach dem Skill `frontend-design`, in drei Schritten: Plan, Überprüfung gegen den Auftrag, Umsetzung mit Selbstkritik.

---

## 1. Erster Designplan (Entwurf)

**Thema:** Prüfungsphase an der HTW Berlin. Nutzer:innen sind Bachelor-Studierende, mobil unterwegs, unter Zeitdruck. Der Kern der App ist eine Frage: *Was kommt als Nächstes, und wie weit bin ich?*

### Farben (Markenvorgaben, siehe Auftrag)

| Name | Wert | Rolle |
|---|---|---|
| HTW-Grün | `#76B900` | Flächen, Balken, Akzente, primäre Aktionen |
| HTW-Blau | `#0082D1` | Links, Fokus, Hinweise |
| HTW-Orange | `#FF5F00` | nur Dringlichkeit (< 7 Tage) und Warnungen |
| Schwarz/Weiß/Grau | `#111`, `#fff`, Graustufen | Text, Flächen, Linien |

Für Text auf hellem Grund werden dunklere Abstufungen abgeleitet (Grün-Text, Blau-Text, Orange-Text), für den Dark Mode helle Abstufungen.

### Schrift

- Eine Familie für alles, mit klaren Rollen über Gewicht und Größe: Systemschrift (`system-ui`).
- Überschriften fett, Fließtext normal, Zahlen tabellarisch.

### Layout

Mobil eine Spalte, ab 1024 px Liste links und Detail rechts. Die nächste Klausur steht oben als große grüne Karte mit Countdown, darunter die weiteren Klausuren als Karten mit Fortschrittsbalken.

```
┌──────────────────────────┐
│ Klausurplan  [Anlegen]   │
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │ Nächste Klausur      │ │
│ │ NOCH 12 TAGE         │ │
│ │ Investitionsrechnung │ │
│ │ ████░░░░ 50 %        │ │
│ └──────────────────────┘ │
│ ┌────────┐ ┌────────┐    │
│ │ Karte  │ │ Karte  │    │
│ └────────┘ └────────┘    │
└──────────────────────────┘
```

### Prinzipien

- Ruhig, aufgeräumt, viel Weißraum.
- Karten mit leichtem Schatten und abgerundeten Ecken.
- Fortschrittsbalken in Grün.
- Kleine Beschriftungen in Großbuchstaben über Abschnitten.

---

## 2. Überprüfung gegen den Auftrag

Prüffrage: *Würde dieser Plan bei jedem beliebigen To-do- oder Kalender-Prompt genauso herauskommen?* Ja, an mehreren Stellen. Die Befunde:

| # | Befund im Entwurf | Problem | Überarbeitung |
|---|---|---|---|
| 1 | Karten mit Schatten und gleichem Radius überall | Genau die im Auftrag verbotene „SaaS-Karten“-Optik; Hierarchie geht verloren | Die Liste wird zu **Kalenderzeilen** ohne Schatten: links ein Datumsblock, Trennung durch Haarlinien. Nur die nächste Klausur ist eine Fläche. Radien sind gestaffelt (Hero 4 px, Felder 8 px, Chips rund). |
| 2 | Großbuchstaben-Label („NOCH 12 TAGE“, Abschnittslabels) | Im Auftrag ausdrücklich zu vermeiden | Alle Beschriftungen in Satzschreibung. Der Countdown wird zur Hauptsache: eine **riesige Tageszahl** mit der Einheit darunter, kein Label darüber. |
| 3 | Grüner Balken als bloßer Füllbalken | Austauschbar; zeigt nur „wie viel“, nicht „woraus“ | **Lernstreifen** als prägendes Element: ein Segment pro Lernthema. Man sieht auf einen Blick, aus wie vielen Themen eine Klausur besteht und welche erledigt sind. Er kehrt in Hero, Liste und Detail wieder. |
| 4 | Hero zeigt nur Titel und Zahl | Beantwortet die zweite Frage des Erfolgskriteriums („woran als Nächstes lernen?“) nicht | Der Hero nennt das **nächste offene Thema**. Die Themenliste markiert es ebenfalls („Als Nächstes“). |
| 5 | „Systemschrift“ ohne Begründung | Wirkt beliebig | Bewusste Entscheidung: Die App darf **keine Netzwerkanfragen** stellen, daher keine Webfonts vom CDN. Die Wirkung kommt aus **Gewicht und Maßstab**: sehr fette, enge Ziffern (Gewicht 800, Laufweite −0,04 em) für Zahlen, ruhiges Regular für Text. |
| 6 | Dringlichkeit nur durch Orange | Verstößt gegen „nie nur über Farbe“ | Dringlichkeit = Uhr-Icon + Text („Noch 3 Tage“ bzw. „In weniger als einer Woche“) + Orange als Verstärkung. |
| 7 | Beliebiger Leerzustand („Keine Daten“) | Leere Zustände sollen führen | Leerer Zustand mit Satz und genau einer Aktion; Themen-Leerzustand verweist auf das Eingabefeld direkt darüber. |
| 8 | Orange für „Löschen“ offen | Orange ist für Dringlichkeit **und Warnungen** erlaubt | Löschen ist eine Warnung → Orange-Fläche mit schwarzem Text (≈ 6,2 : 1), nur im Bestätigungsdialog (Button „Löschen“, orangefarbene Kopflinie). Der Löschen-Auslöser in der Detailansicht bleibt neutral. |

Nach der Überarbeitung bleibt **ein** lauter Moment (der Hero mit der Tageszahl), ein wiederkehrendes Motiv (der Lernstreifen) und sonst Ruhe.

---

## 3. Überarbeiteter Designplan (verbindlich)

### Konzept: „Abreißkalender trifft Lernstreifen“

Die App spricht die Sprache von Stundenplan und Kalenderblatt: Datumsblöcke, Tageszahlen, Linien. Der Lernstreifen ist die Visualisierung des Fortschritts.

### Farben und Tokens (`src/styles/tokens.css`)

| Token | Hell | Dunkel | Zweck |
|---|---|---|---|
| `--color-brand` | `#76B900` | `#76B900` | Flächen: Hero, Balken, primäre Buttons |
| `--color-on-brand` | `#111111` | `#111111` | Text auf Grün (≈ 7,8 : 1) |
| `--color-brand-text` | `#3F6900` | `#8FCF1A` | Grün als Text/Icon auf Grund (6,5 : 1 / 9 : 1) |
| `--color-info` | `#0082D1` | `#0082D1` | Info-Flächen |
| `--color-info-text` | `#0068A8` | `#4DB0F0` | Links, Fokusring (5,9 : 1 / 8 : 1) |
| `--color-urgent` | `#FF5F00` | `#FF5F00` | Flächen/Linien für Dringlichkeit |
| `--color-urgent-text` | `#B33F00` | `#FF8A4D` | Text für Dringlichkeit (5,8 : 1 / 8 : 1) |
| `--color-bg` | `#F2F2F2` | `#111111` | Seitenhintergrund |
| `--color-surface` | `#FFFFFF` | `#1C1C1C` | Formulare, Dialoge |
| `--color-text` | `#141414` | `#F2F2F2` | Text |
| `--color-text-muted` | `#595959` | `#ABABAB` | Sekundärtext |
| `--color-line` | `#D6D6D6` | `#363636` | Haarlinien, Rahmen |

Die Kontrastwerte wurden nach WCAG-Formel berechnet; alle Textfarben liegen ≥ 4,5 : 1.

### Schrift

| Rolle | Einsatz | Einstellung |
|---|---|---|
| Ziffern-Display | Tageszahl im Hero, Tag im Datumsblock | Gewicht 800, `tabular-nums`, Laufweite −0,04 em, Zeilenhöhe 0,85 |
| Überschriften | Modulnamen, Abschnitte | Gewicht 700, Laufweite −0,01 em |
| Fließtext | Angaben, Themen, Hinweise | Gewicht 400, 16 px, Zeilenhöhe 1,5, max. 65 Zeichen Zeilenlänge |
| Meta | Raum, LP, Uhrzeit | Gewicht 500, 14 px, `--color-text-muted` |

Skala: 13 / 14 / 16 / 20 / 28 / 40 px sowie Display `clamp(4.5rem, 24vw, 8rem)`.

### Layout

Linksbündig durchgehend. Mobile-first, Breakpoints 768 px und 1024 px.

```
Mobil (360 px)                 Desktop (≥ 1024 px)
┌───────────────────────┐      ┌─────────────────────────────────────────────┐
│ Klausurplan [Anlegen] │      │ Klausurplan                    [Anlegen]    │
├───────────────────────┤      ├───────────────────┬─────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Investitionsrechnung    │
│▓ 12                  ▓│      │▓ 12               ▓│ Freitag, 12.02.2027     │
│▓ Tage                ▓│      │▓ Tage             ▓│ ▮▮▯▯ 50 %               │
│▓ Investitionsrechnung▓│      │▓ Investitionsrech.▓│                         │
│▓ ▮▮▯▯  50 %          ▓│      │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ Lernthemen              │
│▓ Als Nächstes: Zins… ▓│      ├───────────────────┤ [Neues Thema   ][Hinzu…]│
│▓ [Themen ansehen]    ▓│      │ 16 │ Datenbanksys.│ ☑ Kapitalwertmethode    │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │ Feb│ ▮▮▯▯▯  40 %  │ ☐ Interner Zinsfuß      │
├───────────────────────┤      │───────────────────│ ☐ Annuitätenmethode     │
│ 16 │ Datenbanksysteme │      │ 20 │ Projektmgmt. │                         │
│ Feb│ ▮▮▯▯▯  40 %      │      │ Feb│ ▯▯▯  0 %     │                         │
│───────────────────────│      │───────────────────│                         │
│ 20 │ Projektmanagement│      │ ▸ Vergangene (2)  │                         │
│ ▸ Vergangene (2)      │      └───────────────────┴─────────────────────────┘
└───────────────────────┘
```

Mobil ersetzt die Detailansicht die Liste (Ansichtssteuerung per Zustand, „Zur Übersicht“-Button), ab 1024 px stehen beide nebeneinander.

### Gestaltungsprinzipien

1. **Ein lauter Moment:** Die Tageszahl im grünen Hero ist das Erste, was man sieht.
2. **Ein wiederkehrendes Motiv:** Der Lernstreifen (ein Segment je Thema) ersetzt den gewöhnlichen Balken.
3. **Struktur trägt Information:** Linien trennen Klausuren, der Datumsblock ordnet chronologisch, ein grüner Balken links markiert die Auswahl. Keine dekorativen Schatten oder Verläufe.
4. **Dringlichkeit ist Text + Icon + Farbe.**
5. **Ruhe:** Bewegung nur als Antwort auf Aktionen (Segment füllt sich, Dialog öffnet, Bereich klappt auf) und aus bei `prefers-reduced-motion`.
6. **Sprache:** Duzen, sachlich, ermutigend; Buttons nennen die Handlung („Klausur speichern“).

---

## 4. Selbstkritik nach der Umsetzung

Geprüft in Screenshots bei 360, 768 und 1440 px, hell und dunkel (Chrome headless).

| Beobachtung | Maßnahme |
|---|---|
| Der Button „Klausur anlegen“ brach bei 360 px im Header auf zwei Zeilen um. | `white-space: nowrap` für alle Buttons. |
| Im Hero brach „09:00 Uhr“ mitten in der Angabe um. | Datum, Uhrzeit und Raum sind einzelne, nicht umbrechende Angaben; sie wandern als Ganzes in die nächste Zeile. |
| Lernstreifen mit Segmentbreite-Limit ließ in der Detailansicht eine große Lücke vor dem Prozentwert. | Limit entfernt, die Segmente füllen die Breite. |
| Die vier Angaben der Detailansicht (Datum, Uhrzeit, Raum, LP) waren auf 360 px zu lang gestapelt, auf Desktop zu eng. | `auto-fit`-Raster mit Mindestbreite 8,5 rem. |
| Fokusring (Blau) hat auf der grünen Hero-Fläche rechnerisch nur ≈ 2,5 : 1. | Auf Grün wird der Fokusring schwarz (`--color-focus-on-brand`, ≈ 8,7 : 1). |
| Metadaten mit Mittelpunkten wirkten wie Template-Chrome. | Raum, Uhrzeit und LP stehen als einzelne Angaben mit Abstand, ohne Trennzeichen. |
| Native `<progress>` ließe sich nicht pro Thema segmentieren. | Eigene Segmente (`role="progressbar"`, Segmente ohne Rolle); ohne Segmentangabe fällt die Komponente auf `<progress>` zurück. |

**Bekannte Schwäche:** Auf Desktop ist die rechte Spalte nach dem Start leer und zeigt nur einen Hinweis, bis eine Klausur gewählt wird. Das ist bewusst ehrlich statt einer automatisch geöffneten Klausur, könnte aber in einer nächsten Iteration die nächste Klausur vorauswählen.

### Bewusste Verzichte

- Kein Logo, keine Bild-Wort-Marke: Der Schriftzug „Klausurplan“ mit einem kleinen Lernstreifen-Zeichen genügt.
- Keine Webfonts (Netzwerkverbot im Auftrag).
- Keine Einblend-Animationen beim Laden.
