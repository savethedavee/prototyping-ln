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
cp .env.example .env   # then fill in MONGODB_URI (same instance as the app)
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
