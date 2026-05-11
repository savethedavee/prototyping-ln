# Designentscheide — AutoFinder

Kompakte Referenz. Detaillierte Begründungen siehe Word-Dokument (separat).

## Layout & Navigation

- **Desktop-first** — responsive, aber primär für Desktop optimiert. Vergleichsansicht braucht horizontalen Platz.
- **Top-Bar-Navigation** statt Sidebar — die App hat zu wenige Hauptbereiche für eine Sidebar.
- **Mini-Navigation während Fragebogen** — globale Nav wird durch Logo + „Abbrechen ✕" ersetzt. Verhindert Ablenkung im Prozess.

## Fragebogen-UX

- **Eine Frage pro Screen** statt einer langen Seite. Reduziert kognitive Last.
- **Progress-Bar oben** — gibt Orientierung und „fast geschafft"-Motivation.
- **Variierende Eingabe-Patterns:**
  - Slider für Bereiche (Budget, Prioritäten 1–5)
  - Karten für kategoriale Auswahl mit Erklärung (Nutzung, Antrieb)
  - Chips/Pills für viele Multi-Select-Optionen (Ausstattung)
  - Tile-Grid für Marken (mit Erweiterungs-Button)
- **Optionale Schritte klar markiert** — „optional" im Progress-Header in heller Farbe, separater „Überspringen"-Link im Footer.

## Empfehlungs-Logik

- **Match-Score in Prozent** — übersetzt interne Gewichtung in sofort verständliche Zahl.
- **Score-Visualisierung:** ≥85 % grün hervorgehoben, darunter neutral. Keine aggressiven Ampel-Farben.
- **Modelle unter 60 % Match werden nicht angezeigt** — verhindert Überforderung mit irrelevanten Treffern.
- **Sortierung:** Standard nach Match-Score absteigend. Andere Sortierungen optional.

## Modell-Detail-Seite

- **„Was das für dich bedeutet"-Sektion** vor den technischen Daten. Übersetzt Specs in Alltagskonsequenzen (z.B. „ca. CHF 110 Spritkosten pro Monat" statt „5.4 L/100km"). **Zentrale Differenzierung gegenüber AutoScout24** und Co.
- **Drei Anbieter-Slots** am Ende — ein Slot kann „Empfohlener Partner" sein (Paid Placement mit 2 px-Akzentrahmen). Bewusst nur drei — keine erneute Marktplatz-Suche aufzwingen.

## Vergleichsansicht

- **Best-of-Hervorhebung pro Zeile** — beste Zelle bekommt leicht grünes Hintergrund-Highlight. Spart dem User mentales Zahlen-Vergleichen.
- **Maximal 3 Modelle gleichzeitig** — mehr passt nicht horizontal und überfordert.

## Edge Cases

- **Empty State / wenige Treffer:** statt leerer Seite konkrete Lockerungs-Vorschläge mit „+X Modelle"-Indikator. User kann gezielt einen Filter aufweichen statt von vorne anzufangen.
- **Drafts (unvollständige Fragebögen)** werden automatisch in „Meine Suchen" persistiert mit „Fortsetzen →"-Aktion statt „Öffnen →".

## Persistenz & Daten-Modell

- **„Bearbeiten" einer gespeicherten Suche** kehrt zum Fragebogen mit vorbelegten Werten zurück — deckt die Anforderung „Daten bearbeiten" aus dem Mindestumfang ab.
- **Speichern als Modal** statt Redirect — kein Kontextwechsel für eine simple Aktion. Modal zeigt automatisch generierten Vorschlagsnamen plus Tag-Liste der Suche.

## Visueller Stil (im ersten Pass)

- **Wireframe-artig, minimalistisch** — Schwarz/Weiss/Grau-Basis, Akzentfarben sparsam:
  - Grün für positive Werte (Match ≥85 %, Best-of-Zellen, „günstigster Unterhalt"-Badges)
  - Blau für Hinweise und Tipps
  - Schwarz für Primärbuttons
- **Keine Marken-Identität** in dieser Phase — entsteht erst im finalen Polish-Pass.
- **Typografie:** Eine Sans-Serif-Familie (Inter, System-Default). Drei Grössen: Heading 22 px, Body 13–14 px, Caption 11 px. Zwei Gewichte: 400 regular, 500 medium. Kein Bold.

## Was NICHT entschieden ist

Diese Punkte sind bewusst offen gehalten und können während der Implementierung entschieden werden:
- Genaue Match-Score-Formel (Vorschlag in CLAUDE.md, darf vereinfacht werden)
- Welche konkreten Modelle in der Seed-Datenbank landen (15–20 Stück, Mischung über Marken/Antriebe/Preisklassen)
- Visuelles Feinschliff (Farben, exakte Spacings, Mikrointeraktionen)
