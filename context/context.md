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

1. **Budget** — Range-Slider, CHF 5'000–100'000+
2. **Nutzungszweck** — Multi-Karten: Pendeln, Familie, Freizeit, Stadt, Gewerbe, Sport
3. **Antrieb** — Karten: Verbrenner, Hybrid, Elektro
4. **Marken & Land** *(optional, mit Skip)* — Region + konkrete Marken
5. **Ausstattung** — Multi-Select-Chips, gruppiert in Komfort / Sicherheit / Infotainment / Praktisches
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

#### Offene Punkte aus Schritt 2 — vor Schritt 3 einbauen
- [ ] **Gebraucht / Neu** — Frage im Fragebogen ergänzen (z.B. Step 1 oder neuer Step). Feld `condition: "new" | "used" | "any"` im Store und in `SearchInputs` aufnehmen, Mock-Daten anpassen
- [ ] **Karosserieform (Aufbau)** — Limousine, Kombi, SUV, Van, Coupé usw. als Filterfrage ergänzen. Feld `bodyType` in `CarModel` und `SearchInputs` aufnehmen
- [ ] **Farbe** — Bevorzugte Farbe(n) als optionaler Step. Feld `colors: string[]` in `CarModel`, Filteroption im Fragebogen

### Schritt 3 — MongoDB anbinden
- [ ] MongoDB-Atlas-Cluster aufsetzen, `MONGODB_URI` als env var
- [ ] Seed-Script `scripts/seed.ts` für 15–20 Auto-Modelle
- [ ] Ergebnisliste & Detail aus DB laden (`+page.server.ts` mit `load`)
- [ ] Match-Score-Berechnung serverseitig (gewichtete Summe)

### Schritt 4 — Suchen speichern
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
- **State während Fragebogen:** Svelte-Stores (vor dem Speichern in DB)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`)
- **Komponenten:** klein und wiederverwendbar — z. B. eine `<QuestionnaireFrame>`-Wrapper-Component für alle 6 Schritte

---

## Daten-Modell

### CarModel (Modelle in DB, geseedet)
```ts
{
  _id: ObjectId,
  name: string,           // "Toyota RAV4 Hybrid"
  brand: string,          // "Toyota"
  type: string,           // "Kompakt-SUV"
  drivetrain: "combustion" | "hybrid" | "electric",
  region: "europe" | "asia" | "america",
  priceFrom: number,      // 38900 (CHF)
  consumption: number,    // 5.4 (L/100km, oder kWh/100km bei E)
  power: number,          // 218 (PS)
  trunkSize: number,      // 580 (L)
  co2: number,            // 123 (g/km)
  warranty: number,       // 3 (Jahre)
  seats: number,          // 5
  features: string[],     // ["climate", "carplay", "awd", "rearcam", ...]
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
    usage: string[],              // ["commute", "family"]
    drivetrain: string[],         // ["hybrid"]
    brandRegion?: string,         // "europe" | "asia" | "america" | "any"
    brands?: string[],
    features: string[],           // ["climate", "rearcam", "awd"]
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

### Match-Score-Berechnung (Pseudocode)
```ts
function matchScore(model: CarModel, inputs: SearchInputs): number {
  // Harte Filter
  if (model.priceFrom > inputs.budgetMax) return 0;
  if (inputs.drivetrain.length > 0 && !inputs.drivetrain.includes(model.drivetrain)) return 0;

  let score = 0;
  const featureMatches = inputs.features.filter(f => model.features.includes(f)).length;
  score += (featureMatches / inputs.features.length) * 30;

  if (inputs.brands && inputs.brands.includes(model.brand)) score += 10;

  const consumptionScore = (1 - model.consumption / 10) * inputs.priorities.consumption;
  const powerScore = (model.power / 300) * inputs.priorities.power;
  // ... etc.

  return Math.min(100, score);
}
```

> Formel muss nicht „echt" sein — nur differenziert genug, dass Modelle unterschiedliche Scores bekommen.

---

## Routing-Übersicht

| Route | Screen |
|---|---|
| `/` | Landing |
| `/so-funktionierts` | So funktioniert's |
| `/finder/budget` | Fragebogen Step 1 |
| `/finder/nutzung` | Fragebogen Step 2 |
| `/finder/antrieb` | Fragebogen Step 3 |
| `/finder/marken` | Fragebogen Step 4 (optional) |
| `/finder/ausstattung` | Fragebogen Step 5 |
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

## Notizen für künftige Sessions

- **Vor jedem grösseren Schritt:** kurz halten und bestätigen lassen, bevor weitergeht
- **Bei Unklarheiten:** 2–3 Verständnisfragen stellen statt raten
- **KI-Einsatz** muss in der finalen Projektdoku deklariert werden