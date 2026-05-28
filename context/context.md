# AutoFinder — Projektkontext für Claude Code

> Diese Datei wird von Claude Code bei jeder Session gelesen. Bitte aktuell halten — erledigte Schritte abhaken, neue Entscheide festhalten.

---

## Was ist das?

**AutoFinder** ist eine SvelteKit-Webanwendung, die Personen vor einem Autokauf hilft, das passende Modell zu finden — ohne Vorwissen über technische Spezifikationen.

- **Kontext:** ZHAW-Modulprojekt „Prototyping" (50 % der Modulendnote)
- **Aktuelles Ziel (Übung 11):** Funktionierender End-to-End-Hauptworkflow, MongoDB-Persistenz, deployt auf Netlify
- **Finale Abgabe:** vor Beginn der Prüfungssession
- **Bewertungslogik:** Mindestumfang sauber = Note 4.0; Erweiterungen erhöhen die Note

---

## Hauptworkflow

```
Landing → Fragebogen (6 Schritte) → Ergebnisliste → Modell-Detail → Anbieter-Angebot (extern)
```

Nebenworkflows: Vergleichen (2–3 Modelle) · Suche speichern & wiederaufnehmen

### Fragebogen-Schritte

1. **Budget** — Range-Slider CHF 5'000–100'000+, Pill-Buttons Neu/Gebraucht/Egal
2. **Nutzungszweck** — Multi-Karten: Pendeln, Familie, Freizeit, Stadt, Gewerbe, Sport
3. **Antrieb & Aufbau** — Antrieb (Verbrenner/Hybrid/Elektro) + Karosserieform (SUV/Kombi/…)
4. **Marken** — Region + konkrete Marken (kein Skip, kein Pflichtfeld)
5. **Ausstattung & Farbe** — Feature-Chips nach Kategorie + Farbauswahl mit Egal-Option
6. **Prioritäten** — 5 Slider 1–5: Verbrauch, Leistung, Komfort, Sicherheit, Design

---

## Status / Roadmap

### Schritt 1 — Grundgerüst ✅ ERLEDIGT
- [x] `npx sv create autofinder` mit TypeScript, ESLint, Prettier
- [x] Layout mit Top-Nav (Start · So funktioniert's · Meine Suchen)
- [x] Routen-Stubs für alle Seiten
- [x] Git-Repo initialisiert, erster Commit

### Schritt 2 — Statische Seiten ohne DB ✅ ERLEDIGT
- [x] Landing Page mit CTA „Auto finden", 3-Schritt-Erklärung, Footer
- [x] Fragebogen-Wizard: alle 6 Schritte als eigene Komponenten unter `/finder/`
- [x] `<QuestionnaireFrame>`-Wrapper mit Mini-Nav, Progress-Bar, Footer
- [x] Wizard-Zustand im Svelte-Store (`src/lib/stores/questionnaire.ts`)
- [x] 15 Mock-Modelle als TypeScript-Array (`src/lib/data/mockCars.ts`)
- [x] Ergebnisliste (`/ergebnisse`) mit client-seitiger Match-Score-Berechnung
- [x] `<CarCard>`- und `<MatchScore>`-Komponenten
- [x] Loading-Transition (`/berechnung`) mit CSS-Animation und Redirect
- [x] Modell-Detail (`/modell/[slug]`) mit „Was das für dich bedeutet"-Block
- [x] So funktioniert's-Seite (`/so-funktionierts`) vereinfacht
- [x] Meine Suchen (`/meine-suchen`) als Placeholder
- [x] Klick-Demo durchspielbar: Landing → Fragebogen → Ergebnis → Detail

#### Offene Punkte aus Schritt 2 — erledigt
- [x] **Gebraucht / Neu** — Pill-Buttons (Neu / Gebraucht / Egal) in Step 1 (Budget).
- [x] **Karosserieform** — In Step 3 integriert (unterer Abschnitt "Welche Karosserieform passt zu dir?").
- [x] **Farbe** — In Step 5 integriert (Abschnitt "Farbe" mit Egal-Option, die per default aktiv ist).

### Schritt 3 — MongoDB anbinden ✅ ERLEDIGT
- [x] MongoDB-Atlas-Cluster aufsetzen, `MONGODB_URI` als env var
- [x] Seed-Script `scripts/seed.ts` für alle Modelle (upsert per `slug`, idempotent)
- [x] Ergebnisliste & Detail aus DB laden (`+page.server.ts` mit `load`)
- [x] DB-Layer in `src/lib/server/` (`db.ts` Singleton, `cars.ts` mit `getAllCars`/`getCarBySlug`)
- [x] `sessionStorage`-Persistenz für `searchInputs` (Reload-fest auf Ergebnisseite)
- [ ] Match-Score-Berechnung serverseitig (gewichtete Summe) — *bleibt clientseitig für Live-Reaktivität*

### Schritt 3.5 — Scraper-Package (neu, in Planung)
- [ ] `scraper/`-Package neben `autofinder/` (eigenständig, kein Workspace)
- [ ] AutoScout24.ch via Playwright
- [ ] Output mappt direkt auf `CarOffer`
- [ ] Scraper-Daten erzeugen neue `CarModel`-Einträge (keine kuratierten Modelle)
- [ ] Direktes Upsert in MongoDB (gleiches `MONGODB_URI`)

### Schritt 4 — Suchen speichern (in DB, nicht nur Session)
- [ ] Form Action „Suche speichern" auf der Ergebnisliste
- [ ] „Meine Suchen"-Seite mit Liste aus DB
- [ ] Bearbeiten- und Löschen-Aktionen
- [ ] Drafts (unvollständige Fragebögen) automatisch persistieren

### Schritt 5 — Vergleich
- [ ] Auswahl-Mechanik in Ergebnisliste mit Sticky-Footer
- [ ] Vergleichsansicht für 2–3 Modelle, Tabelle mit Best-of-Hervorhebung

### Schritt 6 — Polish & Deploy
- [ ] Erfolgs-/Fehler-Toasts
- [ ] Empty-State wenn 0 oder 1 Treffer
- [ ] README mit Setup-Anleitung
- [ ] Netlify-Deploy
- [ ] So-funktioniert's-Seite (3 Schritte, einfach)

### Erweiterungen *(erst nach stabilem Mindestumfang)*
- [ ] Mobile-optimiertes Layout
- [ ] Filter auf der Ergebnisliste
- [ ] Mehrere Such-Profile parallel verwalten
- [ ] Echte Anbieter-Anbindung (statt 3 Dummy-Slots)
- [ ] Sortier-Optionen auf der Ergebnisliste

---

## Tech-Stack & Konventionen

- **Framework:** SvelteKit 2 mit TypeScript
- **Styling:** Tailwind CSS 3
- **Datenbank:** MongoDB Atlas
- **Hosting:** Netlify (mit `@sveltejs/adapter-netlify`)
- **Versionierung:** Git/GitHub
- **Datenfetching:** `+page.server.ts` mit `load`-Funktion (kein eigenes API-Layer)
- **Mutationen:** SvelteKit Form Actions (keine REST-API)
- **State während Fragebogen:** Svelte-Stores + `sessionStorage` (Persistierung via `persistSearchInputs()` auf Ergebnisseite, Clear via `clearSearchInputs()` beim Start einer neuen Suche)
- **MongoDB-Connection:** Singleton in `src/lib/server/db.ts` via `$env/dynamic/private`. Seed/CLI-Scripts in `scripts/` nutzen `dotenv` direkt.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`)
- **Komponenten:** klein und wiederverwendbar — z. B. eine `<QuestionnaireFrame>`-Wrapper-Component für alle 6 Schritte

---

## Daten-Modell

> **Architektur-Entscheid:** `CarModel` ist scraper-ready. Jedes `CarOffer` repräsentiert ein einzelnes Inserat (z.B. von AutoScout24) mit allen variantenspezifischen Feldern. `CarModel` gruppiert Inserate nach Modell-Familie.

### CarOffer (ein konkretes Inserat)
```ts
{
  condition: "new" | "used",
  price: number,
  mileage?: number,           // km, nur bei used
  color?: string,             // Farbe dieses Inserats
  bodyType?: "suv" | "kombi" | "limousine" | "kompakt" | "kleinwagen" | "van",
  trunkSize?: number,         // Liter
  drivetrain?: "combustion" | "hybrid" | "electric",
  transmission?: "manual" | "automatic" | "dct",
  power?: number,             // PS
  consumption?: number,       // L/100km oder kWh/100km
  co2?: number,               // g/km
  seats?: number,
  features?: string[],
  year?: number,              // Erstzulassung
  url?: string,               // Link zum Inserat
  images?: string[],
  platform?: string,          // "autoscout24" | "mobile.de" | ...
  listingId?: string,         // Plattform-ID für Deduplizierung
  dealer?: string,
  location?: string,          // Stadt / Kanton
}
```

### CarModel (Modell-Familie, geseedet)
```ts
{
  _id?: ObjectId,
  slug: string,           // "toyota-rav4-hybrid"
  name: string,           // "Toyota RAV4 Hybrid"
  brand: string,          // "Toyota"
  type: string,           // "Kompakt-SUV"
  region: "europe" | "asia" | "america",
  warranty: number,       // 3 (Jahre — Herstellergarantie)
  offers: CarOffer[],
  imageUrl?: string,
  description: string,    // 1–2 Sätze für Listenansicht
  detailText: string      // Längerer „Was das für dich bedeutet"-Text
}
```

### SavedSearch (User-Suchen, persistiert)
```ts
{
  _id: ObjectId,
  name: string,           // "Familienauto Hybrid"
  createdAt: Date,
  updatedAt: Date,
  isDraft: boolean,
  currentStep: number,    // 1–6, für Draft-Wiederaufnahme
  inputs: {
    budgetMin: number,
    budgetMax: number,
    condition: "new" | "used" | "any",
    usage: string[],              // ["commute", "family"]
    drivetrain: string[],         // ["hybrid"]
    bodyTypes: string[],
    colors: string[],
    brandRegion?: string,         // "europe" | "asia" | "america" | "any"
    brands?: string[],
    features: string[],
    priorities: {
      consumption: number,        // 1–5
      power: number,
      comfort: number,
      safety: number,
      design: number
    }
  }
}
```

### Match-Score-Berechnung

Implementiert in `autofinder/src/lib/utils/matching.ts`.

**Harte Filter** (→ Score 0 wenn nicht erfüllt):
- Kein Angebot im Budget / mit passender Condition / Antrieb / Karosserieform
- Falsche Brand-Region

**Soft Scoring** (max 100 Punkte):

| Kriterium | Max |
|---|---|
| Basis | 15 |
| Nutzung (`scoreForUsage`) | 40 |
| Ausstattung (`scoreForFeatures`) | 15 |
| Marke (`scoreForBrand`) | 10 |
| Prioritäten (`scoreForPriorities`) | 10 |
| Budget-Passgenauigkeit (`scoreForBudget`) | 5 |
| Farbe (`scoreForColor`) | 5 |

Nutzungs-Scoring basiert auf `USAGE_CRITERIA` — einer deklarativen Config-Tabelle pro Usage-Typ (`commute`, `family`, `leisure`, `city`, `commercial`, `sport`).

---

## Routing-Übersicht

| Route | Screen |
|---|---|
| `/` | Landing |
| `/so-funktionierts` | So funktioniert's |
| `/finder/budget` | Fragebogen Step 1 |
| `/finder/nutzung` | Fragebogen Step 2 |
| `/finder/antrieb` | Fragebogen Step 3 |
| `/finder/marken` | Fragebogen Step 4 |
| `/finder/ausstattung` | Fragebogen Step 5 (inkl. Farbe) |
| `/finder/prioritaeten` | Fragebogen Step 6 |
| `/berechnung` | Loading-Transition |
| `/ergebnisse?searchId=...` | Ergebnisliste / Empty State |
| `/modell/[slug]` | Modell-Detail |
| `/vergleich?ids=...` | Vergleichsansicht |
| `/meine-suchen` | Meine Suchen |

Keine Authentifizierung im ersten Pass — Suchen werden ohne User-Bindung gespeichert.

---

## Kontext-Ordner

```
context/
├── context.md             ← diese Datei
├── design-decisions.md    ← Designentscheide kompakt
├── mockups/
│   ├── screen-reference.md   ← Screen-Specs für alle 16 Screens
│   ├── all-screens.html      ← Komplettes Wireframe-Set im Browser öffnen
│   └── so-funktionierts.html ← Vereinfachte Standalone-Variante
└── workflows/
    ├── workflow-main.png     ← Hauptworkflow (Activity-Diagramm)
    └── workflow-compare.png  ← Vergleich-Workflow
```

---

## QuestionnaireFrame — Konventionen

- `onReset` → setzt alle Felder des aktuellen Steps zurück; wird im sticky Footer als "Zurücksetzen"-Link angezeigt
- `nextHref` / `nextLabel` → Weiter-Button im sticky Footer; letzter Step nutzt `nextLabel="Empfehlungen ansehen →"`
- `TOTAL_STEPS` kommt aus dem Store (`$lib/stores/questionnaire`), nicht hardcodiert im Frame
- Footer ist `sticky bottom-0 z-10` — auf Seiten ohne Scrollbar kein Layout-Shift (scrollbar-gutter: stable noch ausstehend)

## Notizen für künftige Sessions

- **Vor jedem grösseren Schritt:** kurz halten und bestätigen lassen, bevor weitergeht
- **Bei Unklarheiten:** 2–3 Verständnisfragen stellen statt raten
- **KI-Einsatz** muss in der finalen Projektdoku deklariert werden
- **Scrollbar-Layout-Shift:** `scrollbar-gutter: stable` auf `html` ist als Fix bekannt, noch nicht umgesetzt