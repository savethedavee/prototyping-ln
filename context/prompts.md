# AutoFinder — Implementierungs-Prompts pro Schritt

Jeden Prompt direkt in Claude Code einfügen wenn der jeweilige Schritt dran ist.
Kontext-Files liegen unter `context/` — bitte vor jedem Schritt lesen.

---

## Schritt 2 — Statische Seiten ohne DB

```
Lies zuerst context/context.md, context/design-decisions.md und context/mockups/screen-reference.md.

Implementiere Schritt 2 des AutoFinder-Projekts: alle statischen Seiten ohne Datenbankanbindung.

Aufgaben:
1. Landing Page (`/`) — Hero mit CTA „Auto finden →", 3-Schritt-Erklärung, Footer. Spec: Screen 1 in screen-reference.md.

2. Fragebogen-Wizard — alle 6 Schritte als eigene Svelte-Komponenten unter `src/routes/finder/`:
   - `/finder/budget` — Dual-Range-Slider, CHF 5'000–100'000+
   - `/finder/nutzung` — 6 Karten im 2×3-Grid, Mehrfachauswahl
   - `/finder/antrieb` — 3 grosse Karten, optional „offen für alle"
   - `/finder/marken` — Region-Karten + Marken-Tiles, Skip-Link im Footer
   - `/finder/ausstattung` — Chips gruppiert in 4 Kategorien
   - `/finder/prioritaeten` — 5 Slider 1–5, letzter Button „Empfehlungen ansehen →"
   Spec: Screens 2, 3, 8, 9, 10, 11 in screen-reference.md.

3. `<QuestionnaireFrame>`-Wrapper-Komponente unter `src/lib/components/` — enthält Mini-Nav (Logo + Abbrechen ✕), Progress-Bar (`{currentStep}/6`), Slot für Inhalt, Footer mit Zurück/Weiter-Buttons.

4. Wizard-Zustand als Svelte-Store (`src/lib/stores/questionnaire.ts`) — hält alle Eingaben der 6 Schritte. Navigations-Logik: Weiter/Zurück zwischen den Schritten.

5. Ergebnisliste (`/ergebnisse`) — mit 10–15 hardcodierten Mock-Modellen als TypeScript-Array. Horizontale `<CarCard>`-Komponente mit Bild-Placeholder, Name, Typ-Tag, Beschreibung, Specs-Zeile, Match-Score. Spec: Screen 4.

6. Modell-Detail (`/modell/[slug]`) — mit Mock-Daten. „Was das für dich bedeutet"-Block prominent vor technischen Daten, 3 Anbieter-Slots als Dummy. Spec: Screen 5.

7. Loading-Transition (`/berechnung`) — CSS-Animationen, nach ~1.5s Redirect zu `/ergebnisse`. Spec: Screen 12.

Konventionen:
- Tailwind CSS für alle Styles
- TypeScript überall, keine `any`
- Komponenten in `src/lib/components/`
- Desktop-first, kein Mobile-Aufwand in diesem Schritt
- Kein Bold in Text, Typografie: Inter/System-Font, 3 Grössen (Heading/Body/Caption)
- Primärbuttons schwarz, Match-Score ≥85% grün, darunter neutral
- Commits nach jedem abgeschlossenen Teilschritt (Conventional Commits)

Am Ende soll die Klick-Demo durchspielbar sein: Landing → Fragebogen (alle 6 Steps) → Ergebnisliste → Modell-Detail.
```

---

## Schritt 3 — MongoDB anbinden

```
Lies zuerst context/context.md und context/mockups/screen-reference.md.

Implementiere Schritt 3: MongoDB-Anbindung für AutoFinder.

Voraussetzung: MONGODB_URI ist als Umgebungsvariable gesetzt (lokal in .env, auf Netlify als Site-Variable).

Aufgaben:
1. MongoDB-Client einrichten — `src/lib/server/db.ts` mit Singleton-Verbindung via `mongodb`-Package. Verbindung nur serverseitig verwenden.

2. TypeScript-Interfaces — `src/lib/types.ts` mit `CarModel` und `SavedSearch` exakt nach dem Daten-Modell in context.md.

3. Seed-Script — `scripts/seed.ts` mit 15–20 realistischen Auto-Modellen (Mischung: Verbrenner/Hybrid/Elektro, Europa/Asien, CHF 20'000–90'000, verschiedene Segmente). Script mit `npx tsx scripts/seed.ts` ausführbar.

4. Ergebnisliste aus DB — `src/routes/ergebnisse/+page.server.ts` mit `load`-Funktion:
   - Liest `searchId` aus URL-Params
   - Lädt `SavedSearch` aus DB
   - Lädt alle `CarModel` aus DB
   - Berechnet Match-Score pro Modell (Funktion in `src/lib/server/matching.ts`)
   - Filtert Score < 60 % raus
   - Gibt sortierte Liste zurück

5. Match-Score-Funktion — `src/lib/server/matching.ts` nach dem Pseudocode in context.md. Harte Filter zuerst, dann gewichtete Punkte, normalisiert auf 0–100.

6. Modell-Detail aus DB — `src/routes/modell/[slug]/+page.server.ts` lädt `CarModel` per slug aus DB.

7. Mock-Daten aus Schritt 2 durch echte DB-Calls ersetzen.

Konventionen:
- Alle DB-Operationen nur in `+page.server.ts` oder `src/lib/server/` — nie im Client
- Fehlerbehandlung mit SvelteKit `error()`-Helper wenn Dokument nicht gefunden
- Commit nach DB-Setup, nach Seed-Script, nach funktionierender Ergebnisliste
```

---

## Schritt 4 — Suchen speichern

```
Lies zuerst context/context.md und context/mockups/screen-reference.md (Screen 7, 14).

Implementiere Schritt 4: Suchen speichern, bearbeiten, löschen.

Aufgaben:
1. Suche speichern — am Ende von Schritt 6 des Fragebogens (`/finder/prioritaeten`) wird die `SavedSearch` per Form Action in MongoDB persistiert. Danach Redirect zu `/ergebnisse?searchId=[id]`.

2. Draft-Persistenz — bei jedem „Weiter"-Klick im Fragebogen wird der aktuelle Stand als Draft (`isDraft: true`, `currentStep: N`) gespeichert oder geupdated. Verhindert Datenverlust wenn User abbricht.

3. Speichern-Modal — nach Abschluss des Fragebogens Modal mit automatisch generiertem Namens-Vorschlag (z.B. „Familienauto Hybrid") + Tag-Liste der Suchparameter. Spec: Screen 14. Kein Redirect, Modal schliesst sich und Toast erscheint.

4. „Meine Suchen"-Seite (`/meine-suchen`) — lädt alle `SavedSearch`-Dokumente aus DB. Zeigt Cards mit:
   - Vollständige Suchen: Buttons „Bearbeiten" + „Öffnen →"
   - Drafts (`isDraft: true`): Buttons „Löschen" + „Fortsetzen →"
   Spec: Screen 7.

5. Bearbeiten — „Bearbeiten"-Button lädt die `SavedSearch` und befüllt den Questionnaire-Store mit den gespeicherten Werten. Dann Redirect zu `/finder/budget` — User sieht vorausgefüllten Fragebogen.

6. Löschen — Form Action `?/deleteSearch` mit `searchId`. Kein Confirm-Dialog nötig, einfach Toast „Suche gelöscht".

7. Toast-Komponente — `<Toast>`-Komponente in `src/lib/components/` für Erfolgs- und Fehlermeldungen. Erscheint oben rechts, verschwindet nach 3s.

Konventionen:
- Alle Mutationen als SvelteKit Form Actions, kein fetch/REST
- `use:enhance` für progressive Enhancement ohne Full-Page-Reload
- Commit nach jeder abgeschlossenen Teilaufgabe
```

---

## Schritt 5 — Vergleich

```
Lies zuerst context/context.md, context/design-decisions.md und context/mockups/screen-reference.md (Screen 6).

Implementiere Schritt 5: Vergleichsfunktion für 2–3 Modelle.

Aufgaben:
1. Auswahl-Mechanik in der Ergebnisliste — „+ Vergleich"-Button auf jeder `<CarCard>`. Ausgewählte IDs in einem Svelte-Store (`src/lib/stores/comparison.ts`). Maximal 3 Modelle wählbar — Button deaktivieren wenn 3 erreicht.

2. Sticky-Footer in Ergebnisliste — erscheint sobald ≥2 Modelle ausgewählt sind. Zeigt „X Modelle zum Vergleichen ausgewählt" + „Vergleichen"-Button. Button führt zu `/vergleich?ids=id1,id2,id3`.

3. Vergleichsseite (`/vergleich`) — `+page.server.ts` lädt die 2–3 `CarModel` per IDs aus DB.
   Layout: Tabelle mit Modellen als Spalten und Eigenschaften als Zeilen.
   Zeilen: Preis / Verbrauch / Leistung / Kofferraum / CO₂ / Garantie / Sitze
   Header-Row: Bild-Placeholder, Name, Typ-Tag, Match-Badge je Modell.
   Spec: Screen 6.

4. Best-of-Hervorhebung — pro Zeile die beste Zelle farbig markieren (`bg-green-50` / `text-green-700`). Logik: niedriger ist besser bei Preis/Verbrauch/CO₂, höher ist besser bei Leistung/Kofferraum/Garantie. Legende am Seitenende.

5. „Details →"-Button je Spalte unten — führt zur jeweiligen Modell-Detail-Seite.

6. Breadcrumb „← Zurück zu den Empfehlungen" oben — mit korrekter searchId im Link.

Konventionen:
- Vergleichs-Store wird beim Verlassen der Ergebnisliste nicht automatisch geleert — User kann zurücknavigieren und weitermachen
- Kein Mobile-Aufwand in diesem Schritt
- Commit nach funktionierender Auswahl-Mechanik, nach fertiger Vergleichsseite
```

---

## Schritt 6 — Polish & Deploy

```
Lies zuerst context/context.md und context/design-decisions.md.

Implementiere Schritt 6: Polish, Edge Cases und Netlify-Deployment.

Aufgaben:
1. Empty State — wenn Ergebnisliste 0 oder 1 Treffer hat: eigene Ansicht statt leerer Liste. Zeigt 3 konkrete Lockerungs-Vorschläge mit „+X Modelle"-Indikator. Berechne welcher gelockerte Filter die meisten zusätzlichen Treffer bringt. Buttons „Filter anpassen" + „Trotzdem ansehen". Spec: Screen 13.

2. So funktioniert's-Seite (`/so-funktionierts`) — vereinfachte Variante: Hero, 3 nummerierte Schritte, CTA „Jetzt starten →", Footer. Vorlage: `context/mockups/so-funktionierts.html`. Spec: Screen 16.

3. Netlify-Deploy — netlify.toml prüfen und korrigieren:
   - `base = "autofinder"`
   - `command = "npm run build"`
   - `publish` Zeile entfernen (adapter-netlify regelt das selbst)
   Sicherstellen dass MONGODB_URI in Netlify Site Variables gesetzt ist.

4. README.md — kurze Setup-Anleitung im ZHAW-Format:
   - Voraussetzungen (Node, MongoDB Atlas Account)
   - Installation (`npm install`)
   - Lokale Entwicklung (`npm run dev`)
   - Seed-Script ausführen
   - Umgebungsvariablen (`.env.example` erstellen)

5. Fehlende Micro-Interactions — falls noch nicht vorhanden:
   - Loading-Spinner beim Absenden von Forms
   - Disabled-State auf Buttons während Submit
   - Hover-States auf allen interaktiven Elementen

6. Abschliessende Überprüfung:
   - Alle Routen aus der Routing-Tabelle (context.md) erreichbar
   - Klick-Demo: Landing → Fragebogen → Ergebnis → Detail → Vergleich → Meine Suchen
   - TypeScript-Check: `npm run check` ohne Fehler
   - Netlify-Build lokal testen: `npm run build && npm run preview`

Konventionen:
- KI-Einsatz im Projekt dokumentieren (was wurde generiert) — als Kommentar in README oder separater Abschnitt
- Letzter Commit vor Abgabe: `chore: final cleanup before submission`
```

---

## Erweiterungen *(optional, nach stabilem Mindestumfang)*

```
Lies zuerst context/context.md.

Implementiere eine oder mehrere der folgenden Erweiterungen (je nach verfügbarer Zeit):

A) Mobile-optimiertes Layout
   - Ergebnisliste: vertikale statt horizontale CarCards
   - Filter-Chips: horizontal scrollbar
   - Top-Nav: Hamburger-Menü mit Drawer
   - Fragebogen: Touch-freundliche Slider und Karten
   - Vergleich: horizontal scrollbare Tabelle statt fixe Spalten

B) Filter auf der Ergebnisliste
   - Filter-Bar mit aktiven Tags (Antrieb, Preisklasse, Marke)
   - „+ Filter"-Button öffnet Filter-Panel
   - URL-basierte Filter (Query-Params) damit Links teilbar sind
   - „X Filter zurücksetzen"-Link

C) Sortier-Optionen
   - Dropdown: Match-Score / Preis aufsteigend / Preis absteigend / Leistung
   - Sortierung client-seitig (Store) um DB-Round-Trip zu sparen

D) Mehrere Such-Profile
   - User kann einer Suche ein Such-Profil / Label zuweisen
   - Auf „Meine Suchen" nach Profil filtern

Vor dem Start bestätigen welche Erweiterung(en) implementiert werden sollen.
```
