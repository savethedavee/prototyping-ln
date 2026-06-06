# AutoFinder Scraper

Standalone scraper for [AutoScout24.ch](https://www.autoscout24.ch). It reads
listings from a search-results URL and upserts them into the same MongoDB the
AutoFinder app uses. Listings are mapped to `CarOffer` and grouped into
`CarModel` documents at the **brand + model + variant** level (so `Golf GTI`,
`Golf Variant` and `Mercedes C 200` vs. `C 63` end up as separate models).

This package is intentionally standalone — it is **not** part of the autofinder
workspace and has its own dependencies.

## Setup

```bash
cd scraper
npm install            # also installs the Chromium browser via postinstall
```

Then create a `.env` file with the MongoDB connection (same instance as the app):

```bash
MONGODB_URI=...        # required
MONGODB_DB=autofinder  # optional, defaults to "autofinder"
```

If the browser download is skipped, run it manually:

```bash
npx playwright install chromium
```

## Usage

1. Open autoscout24.ch, build a search (brand, price, filters …).
2. Copy the **results URL** from the address bar.
3. Run:

```bash
npm run scrape -- "https://www.autoscout24.ch/de/s/..." [--max N] [--dry]
```

| Flag      | Meaning                                                        |
| --------- | -------------------------------------------------------------- |
| `<url>`   | AutoScout24.ch search-results URL (required)                   |
| `--max N` | Max number of listings to scrape (default 20)                  |
| `--dry`   | Parse and print only — does **not** write to MongoDB           |

Start with `--dry` to sanity-check the parsed output before writing.

After a real (non-`--dry`) run, the `postscrape` hook automatically prints a
coverage report (see `coverage` below).

## Scripts

All scripts read `MONGODB_URI` (and optional `MONGODB_DB`, default `autofinder`)
from `.env`, except `verify`, which is fully offline.

| Script               | Command                                          | What it does                                                                                                  |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `scrape`             | `npm run scrape -- "<url>" [--max N] [--dry]`    | Scrape an AutoScout24.ch search and upsert `CarModel`/`CarOffer` into MongoDB (see [Usage](#usage)).          |
| `postscrape`         | _(runs automatically after `scrape`)_            | Prints the coverage report once a scrape finishes; same as `coverage`.                                        |
| `coverage`           | `npm run coverage`                               | Tallies the `cars` collection by bodyType, drivetrain, condition, region and price band; flags empty buckets. |
| `check-fields`       | `npm run check-fields`                           | Reports the fill rate of every `CarOffer` field across the DB and lists offers missing `features`.            |
| `verify`             | `npm run verify`                                 | Offline calibration: parses the saved `template*.html` fixtures and asserts `normalize()` output. No DB/browser. |
| `debug`              | `npx tsx src/debug.ts "<listing-url>"`           | Dumps the raw scrape (title, JSON-LD, specs, equipment, images) for a single listing — for fixing selectors. |
| `postinstall`        | _(runs automatically after `npm install`)_       | Installs the Chromium browser via `playwright install chromium`.                                              |

## How data maps

- **Offer fields** (`price`, `mileage`, `power`, `color`, `bodyType`, …) are read
  from the listing's JSON-LD and key-data table. Missing fields are simply
  omitted; the app already treats them as optional.
- **Model fields** that no listing provides (`region`, `type`, `warranty`,
  `description`, `detailText`) are derived/defaulted: `region` from a brand→region
  table, `type` from the body type, the texts from a template.
- **Deduplication:** offers carry a `listingId` (parsed from the URL). Re-running
  the scraper refreshes existing offers instead of duplicating them.

## Note on selectors

Extraction prefers structured data (JSON-LD) over CSS selectors, but AutoScout24
can change its markup. If a field stops parsing, check `src/scrape.ts`
(extraction) and `src/normalize.ts` (German label → field mapping).
