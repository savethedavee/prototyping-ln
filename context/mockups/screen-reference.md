# Screen Reference — AutoFinder Mockups

Diese Datei ist die Quick-Reference für die Implementierung. Sie beschreibt jeden Screen aus den Wireframes mit allem, was du zum Bauen brauchst: Route, Zweck, Komponenten, Daten, Interaktionen.

**Visuelle Vorlagen:** `mockups/all-screens.html` (komplettes Wireframe-Set mit allen 16 Screens) und `mockups/so-funktionierts.html` (vereinfachte Standalone-Variante)

**Workflows:** siehe `workflows/workflow-main.png` und `workflows/workflow-compare.png`

---

## Globales

### Top-Navigation (auf allen Seiten ausser im Fragebogen)
- **Logo links:** Lupen-Icon + „AutoFinder"
- **Links rechts:** Start · So funktioniert's · Meine Suchen
- **Aktiver Link:** schwarz, fett

### Während des Fragebogens
- **Fokussierte Mini-Nav:** nur Logo + „Abbrechen ✕" rechts
- Globale Navigation wird ausgeblendet — verhindert Ablenkung im Prozess

### Footer
- `© 2026 AutoFinder` links, `Datenschutz · Impressum` rechts
- Nur auf Top-Level-Seiten (Landing, So funktioniert's, Meine Suchen)

### Wiederverwendbare Komponenten (Vorschlag)
- `<TopNav>` — globale Navigation
- `<QuestionnaireFrame>` — Wrapper für alle 6 Fragebogen-Schritte (Mini-Nav + Progress-Bar + Slot für Inhalt + Footer mit Zurück/Weiter)
- `<ProgressBar>` — `{currentStep}/6` mit prozentualer Fortschrittsanzeige
- `<CarCard>` — Card mit Modell-Bild-Placeholder, Name, Beschreibung, Specs, Match-Score und Aktionen
- `<MatchScore>` — Prozentzahl, grün ab ≥85 %, sonst neutral
- `<Button>` — primary (schwarz) / secondary (outline)
- `<Badge>` — neutral / info (blau) / success (grün)
- `<Tag>` — kleinere Variante für Filter und Tag-Listen
- `<EmptyState>` — generic empty-state-Layout
- `<Toast>` — Erfolgs-/Fehlermeldungen

---

## Screen 1 — Landing Page

- **Route:** `/`
- **Zweck:** Einstiegspunkt mit klarem Wertversprechen und einem primären CTA
- **Aufbau:**
  - Top-Navigation
  - Hero-Sektion (zentriert): Kicker „DEIN PERSÖNLICHER AUTOBERATER" → grosse H1 → Subtitle → schwarzer CTA-Button „Auto finden →" → Trust-Hinweis darunter („ca. 3 Minuten · Kostenlos · Keine Anmeldung nötig")
  - 3 Steps in einer Row: Bedürfnisse erfassen / Modelle vergleichen / Angebote einsehen
  - Footer
- **CTA-Aktion:** Weiterleitung zu `/finder/budget` (oder `/finder` mit Auto-Redirect zu Step 1)

---

## Screen 2 — Fragebogen Step 1: Budget

- **Route:** `/finder/budget`
- **Zweck:** Budget-Bereich erfassen (Min/Max)
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={1}>`
  - Range-Slider mit zwei Thumbs (Min, Max)
  - Info-Box „Tipp: Plane 10–15 % für laufende Kosten ein."
- **Daten:**
  ```ts
  budget: { min: number, max: number }
  // Default: min=25000, max=45000
  // Bereich: 5000–100000 (mit 100000+ als Open-End)
  ```
- **Validierung:** min < max
- **Footer:** „← Zurück" (deaktiviert auf Step 1) und „Weiter →"

---

## Screen 3 — Fragebogen Step 2: Nutzungszweck

- **Route:** `/finder/nutzung`
- **Zweck:** Wofür wird das Auto hauptsächlich gebraucht (Mehrfachauswahl)
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={2}>`
  - 6 Karten in 2×3-Grid, alle mit Checkbox-Indikator oben rechts
- **Daten:**
  ```ts
  usage: string[]
  // Optionen: "commute" | "family" | "leisure" | "city" | "commercial" | "sport"
  // Mindestens 1 muss ausgewählt sein
  ```
- **Karten:**
  - Pendeln zur Arbeit — „Tägliche Strecke, oft Stadt + Autobahn"
  - Familie & Kinder — „Platz, Sicherheit, Kindersitze"
  - Freizeit & Reisen — „Wochenend-Trips, Sport, Gepäck"
  - Stadt & Kurzstrecke — „Wendig, einparken, sparsam"
  - Gewerblich / Anhänger — „Zugkraft, Ladevolumen, Robustheit"
  - Sport & Fahrspass — „Performance, Handling, Emotion"

---

## Screen 8 — Fragebogen Step 3: Antrieb

- **Route:** `/finder/antrieb`
- **Zweck:** Bevorzugte Antriebsart (Mehrfachauswahl oder „egal")
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={3}>`
  - 3 grössere Karten nebeneinander mit Icon-Slot, Titel, Untertitel, Beschreibung, Badge
  - Checkbox darunter: „Ich bin offen für alle Antriebsarten"
- **Daten:**
  ```ts
  drivetrain: string[] // ["combustion" | "hybrid" | "electric"]
  drivetrainOpenToAll: boolean
  ```
- **Karten-Inhalte:**
  - Verbrenner — „Benzin oder Diesel" / „Bewährt, grosse Reichweite…" / Badge „günstigste Anschaffung"
  - Hybrid — „Voll- oder Plug-in" / „Sparsam in der Stadt, flexibel…" / Badge „beliebter Mittelweg"
  - Elektro — „Vollelektrisch" / „Niedrigste Betriebskosten, leise…" / Badge „günstigster Unterhalt"

---

## Screen 9 — Fragebogen Step 4: Marken & Land *(optional)*

- **Route:** `/finder/marken`
- **Zweck:** Region und konkrete Marken-Präferenzen (kann übersprungen werden)
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={4} optional={true}>`
  - Progress-Header zeigt „Schritt 4 von 6 · optional"
  - Sektion „Region": 4 Karten (Europäisch / Asiatisch / Amerikanisch / Egal)
  - Sektion „Konkrete Marken": Grid mit 12 Marken-Tiles + „+15 weitere"-Erweiterung
  - Footer: unterstrichener „Überspringen"-Link neben „Weiter →"-Button
- **Daten:**
  ```ts
  brandRegion?: "europe" | "asia" | "america" | "any"
  brands?: string[]  // z.B. ["VW", "BMW", "Skoda"]
  ```

---

## Screen 10 — Fragebogen Step 5: Ausstattung

- **Route:** `/finder/ausstattung`
- **Zweck:** Welche Ausstattung muss das Auto haben (Multi-Select)
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={5}>`
  - Chips (Pills) gruppiert in 4 Kategorien
  - Counter unten: „X Ausstattungsmerkmale ausgewählt" + Reset-Link
- **Daten:**
  ```ts
  features: string[]
  ```
- **Kategorien & Optionen:**
  - **Komfort:** climate, seatHeating, steeringWheelHeating, leather, panoramaRoof, sportSeats
  - **Sicherheit & Assistenz:** rearCam, adaptiveCruise, laneAssist, blindSpot, surroundCam, parkAssist
  - **Infotainment:** carplay, navigation, premiumSound, hud, wirelessCharging
  - **Praktisches:** towHitch, awd, roofRails, electricTailgate, sunroof

---

## Screen 11 — Fragebogen Step 6: Prioritäten

- **Route:** `/finder/prioritaeten`
- **Zweck:** Finale Gewichtung — was zählt am Ende am meisten
- **Komponenten:**
  - `<QuestionnaireFrame currentStep={6}>`
  - 5 Slider-Zeilen: Label + Hinweis links, Slider mittig, Wert rechts (`X / 5`)
- **Daten:**
  ```ts
  priorities: {
    consumption: number,  // 1-5
    power: number,
    comfort: number,
    safety: number,
    design: number
  }
  // Default: alle auf 3
  ```
- **Aspekte:**
  - Niedriger Verbrauch — „spart laufende Kosten"
  - Leistung & PS — „Beschleunigung, Überholen"
  - Komfort — „Federung, Geräusch, Sitze"
  - Sicherheit — „Crash-Tests, Assistenten"
  - Design & Image — „Optik, Marke, Status"
- **Footer:** Button-Text statt „Weiter →" hier `"Empfehlungen ansehen →"` — Übergang signalisieren
- **Aktion beim Klick:** Speichern (oder Update) der `SavedSearch`, dann Redirect zu `/berechnung` (oder direkt zu `/ergebnisse`)

---

## Screen 12 — Berechnung / Loading-Transition

- **Route:** `/berechnung` *(optional — kann auch als Inline-Spinner gemacht werden)*
- **Zweck:** Übergang zwischen Fragebogen und Ergebnis. Schafft Vertrauen, dass die Empfehlung wirklich auf Eingaben basiert
- **Komponenten:**
  - Mini-Top-Nav (nur Logo)
  - Kicker „EINEN MOMENT BITTE"
  - H2 „Wir suchen die passenden Modelle für dich"
  - Subtext „Wir vergleichen 850 Modelle mit deinen Angaben"
  - Loading-Bar (kann CSS-Animation sein, ~60 % gefüllt zur Visualisierung)
  - Checkliste mit 5 Schritten, animiert nacheinander abgehakt:
    - ✓ Budget & Antrieb gefiltert
    - ✓ Nutzungsprofil abgeglichen
    - ○ Marken & Ausstattung berücksichtigen…
    - ○ Prioritäten gewichten
- **Dauer:** ca. 1.5–2 Sekunden, dann Redirect zu `/ergebnisse?searchId=...`

---

## Screen 4 — Ergebnisliste

- **Route:** `/ergebnisse?searchId=...`
- **Zweck:** Top-Empfehlungen mit Match-Score; Modelle für Vergleich auswählbar
- **Komponenten:**
  - Top-Navigation
  - Header: Kicker, H2 „X Modelle passen zu dir", Subtext mit Suchparametern
  - Filter-Bar mit aktiven Filter-Tags und „+ Filter"-Button
  - Sortier-Dropdown rechts („Sortieren: Match ▾")
  - Liste von `<CarCard>` (siehe unten)
  - „+ X weitere Empfehlungen anzeigen ▾" am Ende
  - Sticky-Footer wenn Modelle für Vergleich markiert sind: „X Modelle zum Vergleichen ausgewählt" + Vergleichen-Button
- **CarCard-Struktur (horizontal):**
  - Modell-Bild (Placeholder 110×70)
  - Mittlere Sektion: Name + Typ-Tag, Beschreibung (1 Zeile), Specs-Zeile (Preis · Verbrauch · Leistung)
  - Match-Score rechts (Prozent gross, „MATCH" klein)
  - Aktionen-Spalte rechts: „+ Vergleich" (Secondary), „Details →" (Primary)
- **Daten-Quelle:** `+page.server.ts` `load`: liest `SavedSearch` aus DB → berechnet Match für alle `CarModel` → filtert Score ≥60 % → sortiert absteigend

---

## Screen 13 — Empty State / wenige Treffer

- **Route:** gleiche wie Ergebnisliste, alternative Anzeige
- **Zweck:** Bei 0 oder nur 1 Treffer: konkrete Lockerungs-Vorschläge statt leerer Seite
- **Komponenten:**
  - Top-Navigation (wie Ergebnisliste)
  - Empty-Icon (gestrichelter Kreis mit „!"), zentriert
  - H3 „Nur 1 Modell passt zu deiner Suche"
  - Erklärungstext
  - Liste mit 3 Lockerungs-Vorschlägen, jeweils mit „+ X Modelle"-Indikator
    - Budget auf X erhöhen
    - Auch andere Antriebsarten zulassen
    - Andere Sitz-/Feature-Anforderungen lockern
  - Zwei Buttons: „Filter anpassen" (Primary) und „Trotzdem ansehen" (Secondary)
- **Logik:** Welche Vorschläge gezeigt werden, dynamisch berechnen — welcher gelockerte Filter bringt die meisten zusätzlichen Treffer?

---

## Screen 5 — Modell-Detail

- **Route:** `/modell/[slug]` z.B. `/modell/toyota-rav4-hybrid`
- **Zweck:** Detailansicht eines Modells mit Klartext-Erklärung und Anbieter-Slots
- **Aufbau (von oben nach unten):**
  - Breadcrumb-Link „← Zurück zu den Empfehlungen"
  - Hero-Sektion: Bild-Placeholder (240×150) links, rechts Name, Match-Badge, Typ-Beschreibung, Preis, Action-Buttons (Speichern / Vergleichen)
  - **„Was das für dich bedeutet"-Block** (zentrale USP!): Kicker + grauer Card mit Klartext-Beschreibung, die Specs in Konsequenzen übersetzt (z.B. „ca. CHF 110 Spritkosten pro Monat" statt „5.4 L/100km")
  - **Technische Daten:** 4-Card-Grid mit Leistung / Verbrauch / Kofferraum / 0-100
  - **Aktuelle Angebote:** 3 Anbieter-Slots
    - Slot 1: Empfohlener Partner (2px-Akzentrahmen + Badge „Empfohlener Partner" oben)
    - Slot 2: AutoScout24 (Occasionen)
    - Slot 3: Hersteller-Konfigurator
    - Jeder Slot: Name, Standort/Typ, Preis, Verfügbarkeit, CTA-Button
- **Daten:** `CarModel` aus DB; Anbieter-Slots können Dummy/hartcodiert sein

---

## Screen 6 — Vergleichsansicht

- **Route:** `/vergleich?ids=...,...,...`
- **Zweck:** 2–3 Modelle Spalte-für-Spalte vergleichen, beste Werte pro Zeile hervorheben
- **Komponenten:**
  - Breadcrumb „← Zurück"
  - H2 „Modelle vergleichen"
  - Tabellen-Header-Row: Bild-Placeholder, Name, Typ-Tag, Match-Badge je Modell
  - Tabellen-Body mit Zeilen für Preis / Verbrauch / Leistung / Kofferraum / CO₂ / Garantie
  - **Best-of-Hervorhebung:** beste Zelle pro Zeile bekommt `bg-success` (grünes Hintergrund-Highlight)
  - Aktion-Row unten: „Details →"-Button je Spalte
  - Legende unten: „Grün hinterlegt = bester Wert in der Zeile"
- **Logik:** Pro Zeile bestimmen welche Spalte den besten Wert hat (niedriger ist besser bei Verbrauch/CO₂/Preis, höher ist besser bei Leistung/Kofferraum/Garantie)

---

## Screen 7 — Meine Suchen

- **Route:** `/meine-suchen`
- **Zweck:** Übersicht der gespeicherten Such-Profile mit Bearbeiten / Öffnen / Löschen
- **Komponenten:**
  - Top-Navigation („Meine Suchen" aktiv)
  - Header: H2 + Subtext „X gespeicherte Such-Profile" + „+ Neue Suche"-Button rechts
  - Liste von Card-Komponenten je gespeicherter Suche
- **Card-Struktur:**
  - Header-Row: Titel + Meta (`Erstellt am DD.MM.YYYY · Zuletzt geöffnet vor X Tagen`) links, Aktionen-Buttons rechts (Bearbeiten / Öffnen → für komplette Suchen; Löschen / Fortsetzen → für Drafts)
  - Tag-Row mit den wichtigsten Suchparametern: Budget, Antrieb, Nutzung, Sitzanzahl, ggf. „+X weitere"
  - Footer-Row mit Trennlinie: „X Empfehlungen · Y als Favorit · Top: [Modellname]"
- **Daten:** Liste von `SavedSearch` aus DB
- **Draft-Unterschied:** Wenn `isDraft=true` → Card zeigt „Entwurf — nicht abgeschlossen", Buttons werden zu „Löschen" + „Fortsetzen →", Tags zeigen `Schritt X von 6`-Indikator

---

## Screen 14 — Speichern-Modal

- **Trigger:** Speichern-Aktion in Ergebnisliste oder Modell-Detail
- **Komponenten:**
  - Dunkler Backdrop (rgba schwarz, 45 % opacity) über bestehender Seite
  - Modal zentriert, max 440 px breit
  - H5 „Suche speichern" + Erklärungs-Subtext
  - Label „Name" + Input-Feld mit automatisch generiertem Vorschlag (z.B. „Familienauto Hybrid")
  - Sektion „Was wird gespeichert" mit Tag-Liste der Suchparameter
  - Footer-Buttons: Abbrechen (Secondary) / Speichern (Primary)
- **Aktion:** POST zur Form Action `?/saveSearch` → bei Erfolg Modal schliessen, Toast „Suche gespeichert" anzeigen

---

## Screen 15 — Mobile-Ansicht der Ergebnisliste

- Demonstriert dass das Konzept auch mobil trägt
- Statt horizontaler `<CarCard>` werden vertikale Cards verwendet
- Filter-Chips werden horizontal scrollbar
- Sticky-Footer für Vergleichen bleibt unten
- Hamburger-Menü ersetzt Top-Nav-Links
- **Im ersten Pass nicht zwingend nötig** — Mockup zeigt die Idee, Implementierung ist Polish-Aufgabe

---

## Screen 16 — So funktioniert's

- **Route:** `/so-funktionierts`
- **Zweck:** Erklärung der App, optional aufrufbar von der Nav
- **Vereinfachte Variante** (siehe `mockups/so-funktionierts.html`):
  - Hero mit Kicker, Titel „In 3 Minuten zum passenden Auto", Subtitle
  - 3 nummerierte Schritte:
    1. Fragebogen ausfüllen
    2. Empfehlungen ansehen
    3. Vergleichen & entscheiden
  - Repeat-CTA „Jetzt starten →" am Ende
  - Footer
- **Komplexere Variante** (im all-screens.html): zusätzlich 6 Fragebogen-Schritte erklärt, Match-Score-Algorithmus-Sektion und FAQ-Accordion. **Für ersten Pass: vereinfachte Variante nehmen.**

---

## Routing-Übersicht

| Route | Screen | Auth |
|---|---|---|
| `/` | Landing | — |
| `/so-funktionierts` | So funktioniert's | — |
| `/finder/budget` | Fragebogen Step 1 | — |
| `/finder/nutzung` | Fragebogen Step 2 | — |
| `/finder/antrieb` | Fragebogen Step 3 | — |
| `/finder/marken` | Fragebogen Step 4 (optional) | — |
| `/finder/ausstattung` | Fragebogen Step 5 | — |
| `/finder/prioritaeten` | Fragebogen Step 6 | — |
| `/berechnung` | Loading-Transition | — |
| `/ergebnisse?searchId=...` | Ergebnisliste / Empty State | — |
| `/modell/[slug]` | Modell-Detail | — |
| `/vergleich?ids=...` | Vergleichsansicht | — |
| `/meine-suchen` | Meine Suchen | — |

Keine Authentifizierung im ersten Pass — Suchen werden alle ohne User-Bindung gespeichert (Browser-Session oder einfacher localStorage-basierter „Owner"-Identifier).
