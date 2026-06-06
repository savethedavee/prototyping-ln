<div align="center">

# 🚗 AutoFinder — Projektdokumentation

**Der persönliche Autoberater: vom Bedürfnis zum passenden Modell — ohne Fachwissen.**

![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)
![Svelte 5](https://img.shields.io/badge/Svelte_5-Runes-FF3E00?logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Auth.js](https://img.shields.io/badge/Auth.js-Google_OAuth-000000?logo=auth0&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-Scraper-2EAD33?logo=playwright&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7?logo=netlify&logoColor=white)

**Live-Demo:** &nbsp; [mein-auto-finder.netlify.app](https://mein-auto-finder.netlify.app)<br>
**Repository:** &nbsp; [github.com/savethedavee/prototyping-ln](https://github.com/savethedavee/prototyping-ln)

</div>

> ℹ️ **Hinweis zur Ansicht:** Diese Dokumentation am besten mit einem **Markdown-fähigen Viewer** öffnen (z. B. auf **GitHub**, in der IDE-Vorschau von VS Code/WebStorm oder einem Markdown-Editor). Nur so werden **Bilder, Diagramme und Screenshots aus dem `context/`-Ordner** korrekt dargestellt — im reinen Texteditor fehlen diese und die Inhalte sind nicht vollständig verständlich.

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)


---

## 1. Ausgangslage


### Problem

Die Suche nach dem passenden Auto ist für viele Menschen **überwältigend**. Es gibt hunderte Marken, tausende Modelle
und unzählige Varianten — von der Antriebsart über die Karosserieform bis hin zu Ausstattungslinien.

Bestehende Plattformen wie **AutoScout24** oder **mobile.de** sind primär *Marktplätze mit klassischen
Filterfunktionen*: Man muss bereits wissen, *was* man sucht. Wer noch unsicher ist, welches Modell zu den eigenen
Bedürfnissen passt, wird kaum unterstützt. Technische Angaben wie

> „1.5 TSI, 150 PS, DSG, 5.4 L/100 km"

sind für Laien schwer einzuordnen und helfen bei der Entscheidung wenig.

### Ziele

Eine Web-Applikation, die …

- … über einen **geführten Fragebogen** persönliche Anforderungen erfasst (Budget, Nutzungszweck, Antrieb, Marken,
  Ausstattung, Prioritäten),
- … passende Modelle mit einem **Match-Score in %** empfiehlt,
- … technische Spezifikationen in **alltagssprachliche Erklärungen** übersetzt — z. B. „ca. CHF 110 Spritkosten pro
  Monat" statt „5.4 L/100 km".

### Primäre Zielgruppe

Personen **vor einem Autokauf ohne tiefes technisches Fahrzeugwissen**:

| Persona                              | Situation                              | Bedürfnis                                   |
|--------------------------------------|----------------------------------------|---------------------------------------------|
| **Junge Erwachsene / Studierende**   | Erstes eigenes Budget, wenig Erfahrung | Orientierung, was im Budget realistisch ist |
| **Familien mit neuen Anforderungen** | Mehr Platz / Sicherheit nötig          | Schnell passende, alltagstaugliche Modelle  |
| **Gelegenheitsfahrer:innen**         | Im „Modell-Dschungel" verloren         | Verständliche Empfehlung statt Spec-Listen  |

### Weitere Stakeholder

Die folgende **Einfluss-/Interesse-Matrix** aus dem Modul "Strategisches Management" ordnet die Stakeholder ein (vertikal = Einfluss, horizontal = Interesse):

![Stakeholder-Map: Einfluss-/Interesse-Matrix](context/images/artefakte/stakeholder-map.png)

- **ZHAW / Dozierende** *(oben rechts — hoher Einfluss, hohes Interesse):* setzen den methodischen Rahmen und bewerten
  das Projekt — sowohl grosser Einfluss als auch hohes Interesse am Resultat.
- **Autokäufer:innen** *(oben rechts — primäre Zielgruppe):* definieren die Anforderungen und validieren den Prototyp in
  der Evaluation. Ihr Feedback entscheidet, ob die Lösung taugt.
- **AutoScout24** *(oben links — hoher Einfluss, geringes Interesse):* hat kein eigenes Projektinteresse, übt aber über
  den Bot-Schutz grossen Einfluss aus — wird der Scraper blockiert, fehlen die realen Marktdaten.
- **Testpersonen (Peers)** *(unten rechts — geringer Einfluss, hohes Interesse):* liefern wertvolles Feedback in der
  Usability-Evaluation, haben aber keinen Einfluss auf Scope oder technische Entscheide.
- **Händler / Anbieter** *(unten links — aktuell gering/gering):* perspektivisch interessant für Paid Placement und
  Lead-Generierung, im Prototyp-Stadium aber weder aktiv involviert noch einflussreich.

---

## 2. Lösungsidee

### Kernfunktionalität

**Hauptworkflow:**

![Hauptworkflow: Landing → Fragebogen → Berechnung → Ergebnisliste → Modell-Detail → Anbieter](context/images/artefakte/hauptworkflow.png)

- **Nebenworkflow Vergleich:** Ergebnisliste → Modelle markieren → Vergleichsansicht mit Best-of-Hervorhebung → Detail.
- **Nebenworkflow Suche speichern:** Ergebnisliste → speichern → *Meine Suchen*; später „Öffnen" (zurück zur
  Ergebnisliste) oder „Bearbeiten" (zurück zum Fragebogen mit vorbelegten Werten).

### Annahmen (geprüfte Hypothesen)

1. Nutzer:innen bevorzugen einen **geführten Prozess** gegenüber freier Filtersuche, wenn sie noch kein konkretes Modell
   im Kopf haben.
2. Eine **alltagssprachliche Übersetzung** von Spezifikationen schafft mehr Vertrauen und Verständnis als reine
   Zahlenwerte.
3. Ein **Match-Score in Prozent** ist intuitiver als Ranglisten oder Sternebewertungen.

> Diese Annahmen wurden in der Usability-Evaluation ([Kap. 3.5](#35-validate)) gezielt getestet.

### Abgrenzung

- Fokus auf einen **einfachen, intuitiven und „spassigen" Such-Workflow** — kein vollständiger Marktplatz.
- Keine Kaufabwicklung, keine Finanzierung, keine Probefahrt-Buchung.
- Keine vollständige Modell-Datenbank — eine kuratierte, scraper-gestützte Auswahl genügt für den Prototyp.

---

## 3. Vorgehen & Artefakte

Das Projekt folgt dem fünfphasigen Vorgehen **Understand/Define → Sketch → Decide → Prototype → Validate**. Sämtliche
Zwischenartefakte liegen im Ordner [`/context`](context/).

### 3.1 Understand & Define

#### Zielgruppenverständnis & Problemraum

Der Problemraum **„Autokauf & Modellwahl"** wurde analysiert:

- Riesige Modellvielfalt, unübersichtliche Vergleichsportale.
- Technische Spezifikationen für Laien schwer verständlich.
- Spannungsfeld zwischen **emotionaler** und **rationaler** Kaufentscheidung.

#### Wettbewerbs-/Tool-Recherche

| Tool                       | Ansatz                    | Schwäche                                     |
|----------------------------|---------------------------|----------------------------------------------|
| **ADAC Autokatalog**       | Katalog mit KI-Suche      | KI-Suche funktioniert nur selten zuverlässig |
| **Auto Motor und Sport**   | Kurzfragebogen (4 Fragen) | Sehr oberflächlich, wenig packend            |
| **AutoScout24 / Autohero** | Textlastige Ratgeber      | Kein interaktiver, personalisierter Flow     |

**Identifizierte Lücke:** Kein bestehendes Tool kombiniert einen **ausführlichen, personalisierten Fragebogen**
mit **Match-Scoring** *und* **alltagssprachlicher Übersetzung** technischer Daten.

#### How-Might-We-Fragen

- Wie könnten wir Autokäufer:innen helfen, aus der riesigen Modellvielfalt schnell passende Fahrzeuge zu finden?
- Wie könnten wir persönliche Anforderungen so abfragen, dass die Empfehlung wirklich passt?
- Wie könnten wir den Vergleich zwischen Modellen einfacher und verständlicher gestalten?

### 3.2 Sketch

Mehrere Lösungsvarianten wurden in einer **Crazy-8-Skizzenrunde** entworfen und anschliessend die vielversprechendsten
ausgearbeitet.

**Variantenüberblick (Crazy 8):** Workflow-Skizze · klassischer Fragebogen · **Swiping** (Tinder-artig) ·
Beispiel-getrieben · **Chat-Assistent** · **Live-Preview** · **Duelle** (A/B) · Slider-lastig.

| Crazy-8-Skizzen                                          | Ausgearbeitete Skizzen                                                         |
|----------------------------------------------------------|--------------------------------------------------------------------------------|
| ![Crazy-8-Skizzen](context/images/artefakte/skizzen.png) | ![Ausgearbeitete Skizzen](context/images/artefakte/ausgearbeitete_skizzen.png) |

**Wesentliche Unterschiede der Varianten:**

- **Fragebogen** → maximale Kontrolle & Nachvollziehbarkeit, aber weniger verspielt.
- **Swiping / Duelle** → spielerisch, aber ungenau bei vielen Kriterien.
- **Chat** → flexibel, aber schwer kontrollierbar und aufwändig.
- **Live-Preview** → motivierend, weil Ergebnis sofort sichtbar — als Idee in die Ergebnisliste übernommen.

Ausgearbeitet wurden: **Landing Page**, **Live-Preview** und **Detailseite**.

### 3.3 Decide

#### Gewählte Variante & Begründung

Entschieden wurde für den **geführten Fragebogen mit anschliessender Match-Score-Ergebnisliste**.

| Kriterium               | Begründung                                                                        |
|-------------------------|-----------------------------------------------------------------------------------|
| **Verständlichkeit**    | Eine Frage pro Screen → minimale kognitive Last.                                  |
| **Nachvollziehbarkeit** | Match-Score lässt sich transparent aus den Antworten ableiten.                    |
| **Differenzierung**     | Klartext-Erklärung („Was das für dich bedeutet") gibt es bei keinem Wettbewerber. |
| **Machbarkeit**         | Klar strukturierbar in Komponenten, gut testbar.                                  |

#### End-to-End-Ablauf / User Journey

Der Ablauf gliedert sich in den **Fragebogen-Hauptpfad** und zwei **Nebenworkflows** (Vergleich · Suche speichern):

**1) Hauptpfad — vom Bedürfnis zum Angebot**

![Fragebogen-Workflow: Landing → 6 Fragebogen-Schritte → Berechnung → Ergebnisliste → Modell-Detail → Anbieter-Link](context/images/artefakte/fragebogen_workflow.png)

**2) Nebenworkflow — Vergleich**

![Vergleich-Workflow: Ergebnisliste → 2–3 Modelle wählen → Vergleichsansicht mit Best-of-Hervorhebung → Entscheidung → Modell-Detail](context/images/artefakte/vergleich_workflow.png)

**3) Nebenworkflow — Suche speichern & laden**

![Suche-Workflow: Ergebnisliste → Suche speichern → Meine Suchen (Login) → Öffnen / Bearbeiten / Löschen](context/images/artefakte/suche_workflow.png)

#### Referenz-Mockup

Figma-Prototyp: <https://www.figma.com/site/c3eeEbOgd9eKbPJffwAaRU/Prototyping-Woche-10?node-id=0-1&p=f>

<details>
<summary> <b>Mockup-Screens (klicken zum Aufklappen)</b></summary>

| Startseite                                             | Budget                                             | Nutzung                                             |
|--------------------------------------------------------|----------------------------------------------------|-----------------------------------------------------|
| ![](context/images/figma-mockup/startseite_mockup.png) | ![](context/images/figma-mockup/budget_mockup.png) | ![](context/images/figma-mockup/nutzung_mockup.png) |

| Antrieb                                             | Marken                                             | Ausstattung                                             |
|-----------------------------------------------------|----------------------------------------------------|---------------------------------------------------------|
| ![](context/images/figma-mockup/antrieb_mockup.png) | ![](context/images/figma-mockup/marken_mockup.png) | ![](context/images/figma-mockup/ausstattung_mockup.png) |

| Prioritäten                                             | Loading                                                    | Ergebnisse                                             |
|---------------------------------------------------------|------------------------------------------------------------|--------------------------------------------------------|
| ![](context/images/figma-mockup/präferenzen_mockup.png) | ![](context/images/figma-mockup/loading_screen_mockup.png) | ![](context/images/figma-mockup/ergebnisse_mockup.png) |

| Detail                                             | Vergleich                                               | Suche speichern                                             |
|----------------------------------------------------|---------------------------------------------------------|-------------------------------------------------------------|
| ![](context/images/figma-mockup/detail_mockup.png) | ![](context/images/figma-mockup/vergleichen_mockup.png) | ![](context/images/figma-mockup/suche_speichern_mockup.png) |

</details>

#### Tech-Stack-Entscheidungen

| Bereich       | Entscheidung                               | Begründung                                                               |
|---------------|--------------------------------------------|--------------------------------------------------------------------------|
| **Framework** | SvelteKit 2 + Svelte 5 (Runes)             | Vorgabe                                                                  |
| **Sprache**   | TypeScript                                 | Typsicheres Datenmodell (`CarModel`/`CarOffer`), weniger Laufzeitfehler. |
| **Styling**   | Tailwind CSS 3                             | Schnelles, konsistentes Utility-Styling; zentrale Tokens in `app.css`.   |
| **Auth**      | Auth.js (`@auth/sveltekit`) + Google OAuth | Etablierte Lösung, JWT-Sessions ohne eigene Session-DB.                  |
| **Datenbank** | MongoDB                                    | Vorgabe                                                                  |
| **Hosting**   | Netlify                                    | Vorgabe                                                                  |
| **IDE**       | VS Code & WebStorm                         | VS Code (Vorgabe, gute Claude-Code-Integration) + WebStorm für vertrautes JetBrains-Refactoring. |

### 3.4 Prototype

#### 3.4.1 Entwurf (Design)

##### Informationsarchitektur

```
/                     Landing
/so-funktionierts     Erklärseite
/finder/budget …      Fragebogen (6 Schritte, fokussierte Mini-Nav)
/berechnung           Loading-Transition
/ergebnisse           Ergebnisliste (Match-Scores, Filter-Chips)
/modell/[slug]        Modell-Detail (Klartext + Angebote)
/vergleich?ids=…      Vergleichsansicht (2–3 Modelle)
/meine-suchen         Gespeicherte Suchen
/login                Login (Google)
/impressum /datenschutz
```

##### Zentrale Designentscheidungen

- **Eine Frage pro Screen** mit Progress-Bar → reduziert kognitive Last, schafft „fast geschafft"-Motivation.
- **Variierende Eingabe-Patterns je Datentyp:** Range-Slider (Budget, Prioritäten), Karten (Nutzung, Antrieb),
  Chips/Pills (Ausstattung), Tile-Grid (Marken). *Bewusst aus dem UX-Testing heraus angepasst.*
- **Fokussierte Mini-Navigation im Fragebogen** (nur Logo + „Abbrechen") → keine Ablenkung im Prozess.
- **Match-Score in %**, ab **≥ 80 % grün** hervorgehoben, sonst neutral — keine aggressiven Ampelfarben.
- **„Was das für dich bedeutet"-Block** *vor* den technischen Daten — die zentrale Differenzierung gegenüber
  AutoScout24.
- **Best-of-Hervorhebung** pro Zeile im Vergleich — spart mentales Zahlen-Vergleichen.
- **Wireframe-naher, minimalistischer Stil:** Schwarz/Weiss/Grau-Basis, Orange als Akzent, Grün für positive Werte, Blau
  für Hinweise.

##### User Interface — fertige App

> Screenshots der implementierten Anwendung (Light Mode):

| Startseite                                              | Step 1 – Budget                                      | Step 2 – Nutzung                           |
|---------------------------------------------------------|------------------------------------------------------|--------------------------------------------|
| ![Startseite](context/images/app/startseite.png)        | ![Budget](context/images/app/budget.png)             | ![Nutzung](context/images/app/nutzung.png) |
| Hero mit klarem Wertversprechen und einem primären CTA. | Dual-Range-Slider + Pill-Buttons Neu/Gebraucht/Egal. | Multi-Select-Karten für den Nutzungszweck. |

| Step 3 – Antrieb & Aufbau                  | Step 4 – Marken                         | Step 5 – Ausstattung & Farbe                       |
|--------------------------------------------|-----------------------------------------|----------------------------------------------------|
| ![Antrieb](context/images/app/antrieb.png) | ![Marken](context/images/app/marke.png) | ![Ausstattung](context/images/app/ausstattung.png) |
| Antriebs-Karten + Karosserieform.          | Region filtert die konkreten Marken.    | Feature-Chips nach Kategorie + Farbauswahl.        |

| Step 6 – Prioritäten                               | Berechnung                                        | Ergebnisliste                                    |
|----------------------------------------------------|---------------------------------------------------|--------------------------------------------------|
| ![Prioritäten](context/images/app/präferenzen.png) | ![Loading](context/images/app/loading_screen.png) | ![Ergebnisse](context/images/app/ergebnisse.png) |
| 5 Slider 1–5 für die finale Gewichtung.            | Loading-Transition schafft Vertrauen.             | Match-Scores, Filter-Chips, Vergleichsauswahl.   |

| Modell-Detail                                 | Vergleich                                      | Meine Suchen                                        |
|-----------------------------------------------|------------------------------------------------|-----------------------------------------------------|
| ![Detail](context/images/app/detail.png)      | ![Vergleich](context/images/app/vergleich.png) | ![Suchen](context/images/app/suchen.png)            |
| „Was das für dich bedeutet" + reale Angebote. | Tabelle mit Best-of-Hervorhebung pro Zeile.    | Gespeicherte Profile mit Öffnen/Bearbeiten/Löschen. |

| Account-Flyout                                   | Dark Mode – Startseite                                        | Dark Mode – Ergebnisse                                             |
|--------------------------------------------------|---------------------------------------------------------------|--------------------------------------------------------------------|
| ![Flyout](context/images/app/profile_flyout.png) | ![Darkmode Start](context/images/app/darkmode_startseite.png) | ![Darkmode Ergebnisse](context/images/app/darkmode_ergebnisse.png) |
| Flyout mit Dark-Mode-Toggle & Logout.            | Site-weiter Dark Mode (sessionStorage).                       | Auch farbige Badges abgedunkelt.                                   |

#### 3.4.2 Umsetzung (Technik)

##### Technologie-Stack

- **Frontend/Backend:** SvelteKit 2, Svelte 5 (Runes: `$state`, `$derived`, `$props`), TypeScript.
- **Styling:** Tailwind CSS 3, zentrale Design-Tokens & Dark-Mode-Overrides in `src/app.css`.
- **Datenhaltung:** MongoDB Atlas via nativem `mongodb`-Treiber (kein ORM).
- **Authentifizierung:** `@auth/sveltekit` mit Google-Provider (JWT-Sessions).
- **Tests:** Vitest (Matching-Logik); Scraper mit Offline-Verifikation + Coverage-Report.
- **Scraper:** eigenständiges Package mit Playwright + Stealth (siehe [Kap. 4](#4-erweiterungen)).

##### Architektur

![Architektur: Browser-Client (SvelteKit UI, Stores) ↔ SvelteKit-Server auf Netlify (load, Form Actions, Auth.js) ↔ MongoDB Atlas; separater Scraper speist Daten von AutoScout24.ch in die DB](context/images/artefakte/architektur.png)

##### Struktur & Komponenten

```
prototyping-ln/
├── autofinder/                 # SvelteKit-App (Hauptprojekt)
│   ├── src/
│   │   ├── routes/             # Seiten + Server-Loads + Form Actions
│   │   ├── lib/
│   │   │   ├── components/     # CarCard, QuestionnaireFrame, Footer, Nav, …
│   │   │   ├── stores/         # questionnaire.ts, theme.ts
│   │   │   ├── server/         # db.ts (Singleton), cars.ts, savedSearches.ts
│   │   │   ├── utils/          # matching.ts (+ matching.test.ts)
│   │   │   └── types/          # CarModel, CarOffer, SavedSearch, SearchInputs
│   │   ├── auth.ts             # Auth.js-Konfiguration
│   │   ├── hooks.server.ts     # Auth-Handle + Route-Guard
│   │   └── app.css             # Tokens + Dark-Mode
│   └── scripts/check-db.ts     # Dev-Hilfsskript (DB-Check)
├── scraper/                    # Eigenständiges AutoScout24-Scraper-Package
└── context/                    # Alle Projekt-Artefakte (Skizzen, Mockups, Handouts, Screenshots)
```

**Wiederverwendbare Komponenten** entstanden konsequent aus mehrfach genutzten UI-Elementen — z. B.
`<QuestionnaireFrame>` (Mini-Nav + Progress-Bar + Footer für **alle 6** Fragebogen-Schritte), `<CarCard>`, `<Footer>`.

**Modularisierte Kernfunktionen:** Die Matching-Logik lebt isoliert und testbar in `src/lib/utils/matching.ts`;
Datenbankzugriffe sind in `src/lib/server/` gekapselt.

##### Match-Score-Berechnung (`matching.ts`)

**Harte Filter** (→ Score 0, wenn nicht erfüllt):

- Kein Angebot innerhalb Budget / passender Condition / Antrieb / Karosserieform.
- Falsche Marken-Region.

**Soft-Scoring** (Summe = max. 100 Punkte):

| Kriterium              | Funktion             |     Max |
|------------------------|----------------------|--------:|
| Basis                  | —                    |      27 |
| Nutzung                | `scoreForUsage`      |      40 |
| Marke                  | `scoreForBrand`      |      10 |
| Prioritäten            | `scoreForPriorities` |      10 |
| Budget-Passgenauigkeit | `scoreForBudget`     |       5 |
| Farbe                  | `scoreForColor`      |       5 |
| Ausstattung            | `scoreForFeatures`   |       3 |
| **Total**              |                      | **100** |

Das Nutzungs-Scoring basiert auf `USAGE_CRITERIA` — einer **deklarativen Config-Tabelle** pro Usage-Typ (`commute`,
`family`, `leisure`, `city`, `commercial`, `sport`). Über `matchBreakdown()` ist der Score pro Dimension einsehbar;
daraus speist sich auch die personalisierte „Was das für dich bedeutet"-Begründung. Die Logik ist mit **Vitest**
abgedeckt (`matching.test.ts`).

##### Daten & Schnittstellen

- **Lesen:** ausschliesslich über `+page.server.ts` `load()` — kein separates API-Layer.
- **Schreiben (Mutationen):** über **SvelteKit Form Actions** mit `use:enhance` (Suche speichern/umbenennen/löschen) —
  kein REST/fetch.
- **State im Fragebogen:** Svelte-Stores + **`sessionStorage`** (Persistierung via `persistSearchInputs()`, Reset via
  `clearSearchInputs()`).
- **Datenmodell:** `CarModel` (Modell-Familie) gruppiert mehrere `CarOffer` (einzelne Inserate) — bewusst
  **scraper-ready** entworfen.

<details>
<summary> <b>Datenmodell im Detail</b></summary>

```ts
// CarOffer — ein konkretes Inserat
type CarOffer = {
    condition: "new" | "used"; price: number; mileage?: number; color?: string;
    bodyType?: "suv" | "kombi" | "limousine" | "kompakt" | "kleinwagen" | "van";
    trunkSize?: number; drivetrain?: "combustion" | "hybrid" | "electric";
    transmission?: "manual" | "automatic" | "dct"; power?: number; consumption?: number;
    co2?: number; seats?: number; features?: string[]; year?: number; url?: string;
    images?: string[]; platform?: string; listingId?: string; dealer?: string; location?: string;
};

// CarModel — Modell-Familie (via Scraper befüllt)
type CarModel = {
    _id?: string; slug: string; name: string; brand: string; type: string;
    region: "europe" | "asia" | "america"; warranty: number; offers: CarOffer[];
    imageUrl?: string; description: string; detailText: string;
};

// SavedSearch — persistierte Nutzer-Suche
type SavedSearch = {
    _id: string; name: string; createdAt: Date; updatedAt: Date; inputs: SearchInputs;
};
```

</details>

##### Deployment

- **Adapter:** `@sveltejs/adapter-netlify`, Konfiguration in `netlify.toml` (`base = "autofinder"`,
  `command = "npm run build"`).
- **Env-Variablen:** `MONGODB_URI`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.

> https://mein-auto-finder.netlify.app/

##### Besondere Entscheidungen / Trade-offs

- **Match-Score bleibt clientseitig** (statt serverseitig), damit die Empfehlung bei Eingabeänderungen live reagiert.
- **Keine eigene Session-Collection** — JWT-Strategie von Auth.js genügt für den Prototyp.
- **`getPrimaryOffer()`** liefert das Anzeige-Angebot (erstes „new", sonst erstes) — bewusste Vereinfachung gegenüber
  „bestem" Angebot.

##### Lokales Setup

```bash
# App
cd autofinder
npm install
# .env anlegen mit: MONGODB_URI, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
# Daten: die cars-Collection wird über den Scraper befüllt (siehe scraper/README.md)
npm run dev         # http://localhost:5173

# Tests / Checks
npm run test        # Vitest (Matching-Logik)
npm run check       # svelte-check / TypeScript
```

### 3.5 Validate

Die Usability-Evaluation wurde gemäss dem vorbereiteten Testskript durchgeführt (Vorlage: [
`context/usability-evaluation-vorbereitung.pdf`](context/usability-evaluation-vorbereitung.pdf)).

#### Ziele der Prüfung

- Können Personen **ohne Auto-Vorwissen** den Fragebogen selbständig durchlaufen?
- Ist der **Match-Score (%)** als Konzept verständlich und vertrauenswürdig?
- Wird der **„Was das für dich bedeutet"-Block** als Mehrwert gegenüber einer klassischen Spec-Liste wahrgenommen?
- Ist die **Navigation** zwischen Ergebnisliste und Detail intuitiv?
- Finden Nutzer:innen die **Vergleichsfunktion** und verstehen die Best-of-Hervorhebung?

#### Vorgehen

- **Methode:** kurze Aufgaben-Einführung, danach **unmoderiertes** Beobachten nach dem Laut-Denken-Prinzip (minimale Intervention).
- **Aufgaben:** szenariobasiert, ausgedruckt; Beobachtungs- und Issue-Tabelle (Nielsen-Schweregrad 0–4).

**Szenario 1 (Auto finden):** Die Testperson erhält nur eine kurze Ausgangslage und soll **ohne weitere Erklärung**
selbständig ein für sie passendes Auto finden — Aufgabe 1a: passende Modelle finden; Aufgabe 1b: ein Modell genauer ansehen.

**Szenario 2 (Vergleich):** Zwei interessante Modelle direkt gegenüberstellen und anhand der Vergleichsansicht eine
Entscheidung begründen.

#### Durchführung & Stichprobe

- **Datum / Ort:** 20.05.2026, Kleinklasse / on-site
- **Stichprobe:** 3 Kommiliton:innen, 20–25 J., kein Auto-Fachwissen, starke UX Erfahrung vorhanden
- **Setup:** deployter Prototyp, unmoderiert

#### Kennzahlen

| Aufgabe                       | Erfolgsquote | Ø Zeitbedarf | Schwierigkeit (0–4) |
|-------------------------------|:------------:|:------------:|:-------------------:|
| 1a — passendes Auto finden    |    2 / 3     |    01:30     |          3          |
| 1b — Modell-Detail ansehen    |    3 / 3     |    00:47     |          1          |
| 2a — Vergleich starten        |    3 / 3     |    01:12     |          2          |

#### Qualitative Beobachtungen

- **Workflow durchgängig verständlich:** Alle Testpersonen erfassten den Ablauf vom Fragebogen bis zur Ergebnisliste
  ohne Erklärung und wussten an jedem Schritt, was zu tun war.
- **UX positiv wahrgenommen:** Die geführte, aufgeräumte Bedienung wurde durchwegs gelobt — die Schritt-für-Schritt-Logik
  wirkte unterstützend statt einschränkend.
- **Fehlende Filter:** Mehreren Personen fehlten Eingrenzungsmöglichkeiten (insb. Karosserieform, Farbe, Zustand) — diese
  wurden anschliessend als Erweiterung nachgezogen (siehe Findings unten und [Kap. 4.4](#4-erweiterungen)).
- **Datenbasis noch zu dünn:** Die Auswahl an Modellen/Angeboten war für realistische Empfehlungen noch nicht
  ausreichend. Als Massnahme entstand der **AutoScout24-Scraper**, der echte Inserate in die Datenbank einspeist
  ([Kap. 4.1](#4-erweiterungen)).

#### Beobachtungen & abgeleitete Verbesserungen

Aus dem Test ergaben sich folgende Findings (→ Massnahmen in [Kap. 4](#4-erweiterungen) umgesetzt):

| # | Beobachtung / Issue                                          |  Schweregrad   | Abgeleitete Verbesserung                                | Referenz (Kap. 4) |   Status   |
|---|--------------------------------------------------------------|:--------------:|---------------------------------------------------------|:-----------------:|:----------:|
| 1 | Suchbegriffe blieben beim Start einer neuen Suche bestehen   |   3 (gross)    | Reset der Eingaben beim Start einer neuen Suche         |        4.5        | umgesetzt  |
| 2 | Filter **Karosserieform** fehlte zur Eingrenzung             |   2 (klein)    | Karosserie-Auswahl im Fragebogen + harter Filter        |        4.4        | umgesetzt  |
| 3 | Filter **Farbe** fehlte                                      |   2 (klein)    | Farbauswahl im Fragebogen + Soft-Score (`scoreForColor`)|        4.4        | umgesetzt  |
| 4 | Filter **Zustand** (Neu/Gebraucht) fehlte                    |   2 (klein)    | Pill-Buttons Neu/Gebraucht/Egal + harter Filter         |        4.4        | umgesetzt  |
| 5 | Wunsch nach **Dark Mode**                                    | 1 (kosmetisch) | Site-weiter Dark Mode mit Toggle im Account-Flyout      |        4.3        |  umgesetzt |
| 6 | **Datenbasis zu dünn** für realistische Empfehlungen         |   3 (gross)    | AutoScout24-Scraper für echte Inserate                  |        4.1        |  umgesetzt |

#### Überprüfung der Annahmen

Die drei in [Kap. 2](#2-lösungsidee) formulierten Hypothesen liessen sich im Test **alle bestätigen**:

| # | Annahme |  Ergebnis  | Beobachtung im Test |
|---|---------|:----------:|---------------------|
| 1 | Nutzer:innen bevorzugen einen **geführten Prozess** gegenüber freier Filtersuche | bestätigt  | Die Testpersonen kamen ohne Erklärung durch den Fragebogen und empfanden die Schritt-für-Schritt-Führung als angenehm statt einschränkend. |
| 2 | **Alltagssprachliche Übersetzung** schafft mehr Vertrauen als reine Zahlenwerte | bestätigt  | Der „Was das für dich bedeutet"-Block wurde klar als Mehrwert gegenüber einer reinen Spec-Liste (AutoScout24) wahrgenommen. |
| 3 | Ein **Match-Score in %** ist intuitiver als Ranglisten oder Sterne |  bestätigt | Die Prozentzahl wurde sofort verstanden, als vertrauenswürdig eingestuft und als Sortier-/Entscheidungshilfe genutzt. |

Damit trägt das zentrale Lösungskonzept — geführter Fragebogen + verständlicher Match-Score + Klartext-Erklärung — auch
in der Praxis.

#### Zusammenfassung der Resultate

**Positiv** hervorgehoben wurde:

- die **UX** (geführter, klarer Ablauf),
- das **Design** (aufgeräumt, verständlich),
- die **Funktionalität** — Testpersonen würden die App tatsächlich vor einem Autokauf nutzen.

**Verbesserungspotenzial** (s. Tabelle oben) wurde unmittelbar in konkrete Erweiterungen überführt.

---

## 4. Erweiterungen

> Alle Erweiterungen wahren den Mindestumfang.

Jede Erweiterung ist als kompakte Tabelle dokumentiert: **Nutzen · Umsetzung · Referenz · aus Evaluation abgeleitet?**

### 4.1 AutoScout24-Web-Scraper (eigenständiges Package)

| Aspekt | Details |
|---|---|
| **Nutzen** | Ein **standalone Scraper** liest reale Inserate von [AutoScout24.ch](https://www.autoscout24.ch) aus einer Such-URL und schreibt sie als `CarOffer`/`CarModel` in dieselbe MongoDB wie die App → **echte Marktdaten** statt nur Mock-Daten (Qualitätssprung in Realismus & Datentiefe). |
| **Umsetzung** | • Eigenes Package `scraper/` (Playwright + `playwright-extra` + `puppeteer-extra-plugin-stealth`, tsx, mongodb)<br>• Extraktion bevorzugt **JSON-LD**, Fallback auf deutsche Spec-Labels (`normalize.ts`)<br>• Gruppierung nach *Marke + Modell + Variante* → `slug`; Dedup per `listingId` (`upsert`)<br>• CLI `npm run scrape -- "<url>" [--max N] [--dry]`; zusätzlich `coverage`, `check-fields`, `verify`, `debug` |
| **Referenz** | [`scraper/README.md`](scraper/README.md); Datenmodell in `autofinder/src/lib/types/` |
| **Aus Evaluation?** | ✅ Ja — Issue #6 (zu dünne Datenbasis); zugleich eigenständige technische Vertiefung |

### 4.2 Authentifizierung mit Google (OAuth)

| Aspekt | Details |
|---|---|
| **Nutzen** | Vollständiger **Login mit Google** via **Auth.js**. Geschützte Bereiche (z. B. *Meine Suchen*) nur angemeldet erreichbar; Suchen an eine Nutzeridentität bindbar. |
| **Umsetzung** | • Config `src/auth.ts` (Google-Provider, JWT-Sessions, `session`-Callback → Google-`sub` als `user.id`)<br>• Route-Guard `src/hooks.server.ts` + `+layout.server.ts` → Redirect auf `/login?callbackUrl=…`; öffentliche Pfade via `lib/publicRoutes`<br>• Frontend: gestylte `/login`, `signIn`/`signOut` im Account-Flyout |
| **Referenz** | Account-Flyout-Screenshot in [Kap. 3.4.1](#341-entwurf-design) |
| **Aus Evaluation?** | Nein — eigenständige Funktions-Erweiterung |

### 4.3 Dark Mode (site-weit)

| Aspekt | Details |
|---|---|
| **Nutzen** | Umschaltbarer **Dark Mode**, der **site-weit** greift und die Einstellung in **`sessionStorage`** hält (flackerfrei vor dem ersten Paint). |
| **Umsetzung** | • Frontend: Toggle im Account-Flyout (`Nav.svelte`); Theme-Store `theme.ts`<br>• Styling: `darkMode: 'class'` + globale `.dark`-Overrides in `app.css` (Neutraltöne **und** farbige Badges); Pre-Paint-Script in `app.html` |
| **Referenz** | Dark-Mode-Screenshots in [Kap. 3.4.1](#341-entwurf-design) |
| **Aus Evaluation?** | ✅ Ja — Issue #5 |

### 4.4 Zusätzliche Filter: Karosserie · Farbe · Zustand

| Aspekt | Details |
|---|---|
| **Nutzen** | Fragebogen erfasst zusätzlich **Karosserieform**, **Farbe** und **Zustand** (Neu/Gebraucht/Egal); fliessen als harte Filter bzw. Soft-Score ins Matching und als Filter-Chips in die Ergebnisliste. |
| **Umsetzung** | • Frontend: Steps `budget` (Zustand), `antrieb` (Karosserie), `ausstattung` (Farbe); Filter-Chips in `ergebnisse/+page.svelte`<br>• Logik: `getRelevantOffers()` / `scoreForColor()` in `matching.ts` (inkl. `normalizeColor()` für rohe Farbstrings wie „Schwarz"/„black") |
| **Referenz** | `ergebnisse/+page.svelte`, `matching.ts` |
| **Aus Evaluation?** | ✅ Ja — Issues #2–#4 |

### 4.5 Reset der Eingaben bei neuer Suche

| Aspekt | Details |
|---|---|
| **Nutzen** | Beim Start einer neuen Suche werden alte Eingaben zurückgesetzt — verhindert irritierende „Geister-Filter". |
| **Umsetzung** | `clearSearchInputs()` in `src/lib/stores/questionnaire.ts`, ausgelöst über den „Auto finden"-Einstieg |
| **Referenz** | `src/lib/stores/questionnaire.ts` |
| **Aus Evaluation?** | ✅ Ja — Issue #1 |

### 4.6 Qualitätssicherung durch Tests

| Aspekt | Details |
|---|---|
| **Nutzen** | Automatisierte Tests sichern die fehleranfälligsten Stellen ab. |
| **Umsetzung** | • **Vitest** für die Matching-Logik (`matching.test.ts`: harte Filter, Score-Grenzen, Farb-Normalisierung)<br>• Scraper: Offline-`verify` (HTML-Fixtures) + `coverage`/`check-fields` (Daten-Vollständigkeit) |
| **Referenz** | `matching.test.ts`, `scraper/src/verify-template.ts` |
| **Aus Evaluation?** | Nein — Prozess-/Qualitäts-Erweiterung |

### 4.7 Persistenz via `sessionStorage` & UX-Feinschliff

| Aspekt | Details |
|---|---|
| **Nutzen** | Fragebogen-Eingaben überleben Reloads (Reload-fest). Zusätzlich UX-Feinschliff aus dem Testing: **sticky Navigation**, an den **Datentyp angepasste Eingabefelder**, **Progress-Bar**, prägnante **Match-Score-Wirkung**. |
| **Umsetzung** | • `questionnaire.ts` (`persistSearchInputs`) — Eingaben in `sessionStorage`<br>• `theme.ts` — Dark-Mode-Präferenz in `sessionStorage` (siehe [Kap. 4.3](#43-dark-mode-site-weit)) |
| **Referenz** | `src/lib/stores/` |
| **Aus Evaluation?** | Teilweise — UX-Feinschliff durch Beobachtungen im Testing |

---

## 5. Projektorganisation

### Repository & Struktur

**Repository:** <https://github.com/savethedavee/prototyping-ln>

Monorepo mit klarer Trennung: **`autofinder/`** (App) · **`scraper/`** (eigenständiges Tool) · **`context/`** (sämtliche
Artefakte: Skizzen, Mockups, Workflows, Handouts, Screenshots).

### Issue-Management

Aus den Phasen 3.1 / 3.2 / 3.3 wurde ein Arbeitsplan abgeleitet (siehe Roadmap in [
`context/context.md`](context/context.md)). Dieser wurde **iterativ** abgearbeitet und laufend aufgefrischt, bis der
definierte Umfang erreicht war. Aus der Evaluation entstandene Findings wurden als priorisierte Verbesserungen in den
Plan zurückgespielt ([Kap. 3.5](#35-validate)).

Konkret wurde für alle funktionalen und technischen Features ein eigenes Issue erfasst und anschliessend nach
Priorität abgearbeitet — von den Kernfunktionen (Fragebogen, Matching, Ergebnisliste) über die Persistenz bis zu den
Erweiterungen (Scraper, Auth, Dark Mode). Das folgende Board zeigt diesen iterativen Stand:

![Issue-Board mit den iterativ abgearbeiteten Aufgaben](context/images/artefakte/issue_board.png)

### Commit-Praxis

Commits folgen den **[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)** (`feat:`, `fix:`,
`refactor:`, `chore:`) — sprechende, atomare Commits erleichtern Nachvollziehbarkeit und Review.

---

## 6. KI-Deklaration

### 6.1 KI-Tools

- **Eingesetztes Tool:** **Claude Code** (Anthropic), Modelle **Opus 4.6 / 4.7 / 4.8**.
- **Zweck & Umfang:** Unterstützung beim Ausprogrammieren von Komponenten, Refactorings, Tests sowie bei der
  Aufbereitung dieser Dokumentation. Architektur-, Design- und Tech-Stack-Entscheidungen wurden eigenständig getroffen;
  dank mehrjähriger Erfahrung im Web-/Fullstack-Development wurde auch ohne KI-Agent programmiert.
- **Eigene Leistung (Abgrenzung):** Problemanalyse, Konzept, Skizzen, Mockup, Datenmodell, Match-Logik-Design,
  Scraper-Idee, Evaluation und alle inhaltlichen Entscheide stammen von mir. KI-Output wurde **kritisch geprüft**, gegen
  bekannte Patterns gespiegelt, Code Smells aufgedeckt und Redundanz minimiert.

### 6.2 Prompt-Vorgehen

Grundlegendes Vorgehen (iterativ):

1. **Lösungsvarianten** erarbeiten lassen und **abwägen**.
2. Favorisierte Variante **genauer ausarbeiten**.
3. **Iterativ umsetzen** mit stetigem Feedback zu **Code-Qualität, Funktionalität und UX**.
4. **Kontextquellen** bereitstellen und pflegen: `context/`-Dateien (`context.md`, `design-decisions.md`,
   `screen-reference.md`).


### 6.3 Reflexion

#### Was gut funktioniert hat

- **Usability-Testing als Iterationszyklus:** Der Nutzertest war der wertvollste Schritt. Er deckte konkrete Schwächen
  auf (nicht zurückgesetzte Eingaben, fehlende Filter), die ich gezielt behoben und in einer **zweiten Testrunde** erneut
  geprüft habe — aus einer Momentaufnahme wurde so eine echte Verbesserungsschleife.
- **KI bei klar umrissenen Aufgaben:** Beim Ausprogrammieren klar definierter Aufgaben (Komponenten, Refactorings,
  Tests) war die KI sehr effizient und schuf Freiraum für Konzept, UX und Datenqualität.
- **TypeScript als Sicherheitsnetz:** Das typisierte Datenmodell (`CarModel`/`CarOffer`) führte zu robusterem Code und
  fing viele Fehler bereits zur Entwicklungszeit ab.

#### Verbesserungspotenzial & Learnings

- **Scraper vs. Bot-Schutz:** Der Scraper wurde von AutoScout24 wiederholt **blockiert** (Bot-/Cloudflare-Schutz) und
  musste mehrfach nachgebessert werden (Stealth-Plugin, realistische Browser-Signale). Learning: Bei fremden Quellen
  früher eine robuste Strategie einplanen und Aufwand grosszügiger schätzen.
- **Aufwändige Datenaufbereitung:** Die HTML-/Datenanalyse der Inserate war **intensiv und zeitaufwändig**, bis verlässlich
  saubere, strukturierte Daten entstanden (JSON-LD + Label-Mapping in `normalize.ts`).
- **KI kritisch behandeln:** Die KI lieferte **nicht selten Code Smells oder redundanten Code**. Jeder Beitrag musste
  **kritisch geprüft**, gegen bekannte Patterns gespiegelt und vereinfacht werden. Abgesichert wurde dies durch
  automatisierte **Tests** (Vitest), **`svelte-check`/TypeScript** und eine saubere **Commit-Historie**.

> **Fazit:** KI ist ein starker Beschleuniger für Routinearbeit, ersetzt aber weder fachliche Entscheidungen noch
> sorgfältiges Review — und bei nicht-standardisierten Problemen (Scraping) bleibt die eigene Ingenieurleistung
> ausschlaggebend.

---

## 7. Anhang

### Quellen & Lizenzen

- **Dokumentationsvorlage:** ZHAW-Modul *Prototyping* (`context/handouts/VORLAGE_README.md`).
- **Bibliotheken:** SvelteKit, Svelte, Tailwind CSS, Auth.js (`@auth/sveltekit`), MongoDB Node Driver, Playwright /
  playwright-extra / puppeteer-extra-plugin-stealth, Vitest, tsx.
- **Datenquelle:** AutoScout24.ch (öffentliche Inserate, via Scraper). Modell-/Inseratsdaten und Bilder gehören den
  jeweiligen Rechteinhabern; Nutzung ausschliesslich zu **Prototyp-/Studienzwecken**.


### Testskript & Materialien

- Usability-Evaluation: [`context/usability-evaluation-vorbereitung.pdf`](context/usability-evaluation-vorbereitung.pdf)
- Artefakte: [`context/`](context/) (Skizzen, Mockups, Workflows, Screenshots)

### Weiterführende Dokumentation

- Scraper: [`scraper/README.md`](scraper/README.md)
- Projektkontext & Roadmap: [`context/context.md`](context/context.md)
- Designentscheide: [`context/design-decisions.md`](context/design-decisions.md)

