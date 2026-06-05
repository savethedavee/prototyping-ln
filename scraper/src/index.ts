import 'dotenv/config';
import type { CarModel } from './types.js';
import { buildModelScaffold, buildSlug } from './model.js';
import { normalize } from './normalize.js';
import { collectListingUrls, humanDelay, launch, newPage, scrapeListing } from './scrape.js';
import { closeDb, upsertModel } from './db.js';

interface Args {
	url: string;
	max: number;
	dry: boolean;
}

function parseArgs(argv: string[]): Args {
	const rest = argv.slice(2);
	let url = '';
	let max = 20;
	let dry = false;

	for (let i = 0; i < rest.length; i++) {
		const a = rest[i];
		if (a === '--dry') dry = true;
		else if (a === '--max') max = Number(rest[++i]) || max;
		else if (a.startsWith('--max=')) max = Number(a.slice(6)) || max;
		else if (!a.startsWith('--')) url = a;
	}

	return { url, max, dry };
}

function usage(): never {
	console.error(
		[
			'Usage: npm run scrape -- "<autoscout24-search-url>" [--max N] [--dry]',
			'',
			'  <url>     AutoScout24.ch search-results URL (build the search on the site, copy the URL)',
			'  --max N   max listings to scrape (default 20)',
			'  --dry     parse and print only, do NOT write to MongoDB'
		].join('\n')
	);
	process.exit(1);
}

async function main() {
	const args = parseArgs(process.argv);
	if (!args.url || !/autoscout24\./i.test(args.url)) usage();

	console.log(`▶ Scraping up to ${args.max} listings${args.dry ? ' (dry run)' : ''}`);
	console.log(`  Search: ${args.url}\n`);

	const context = await launch();
	const page = await newPage(context);

	let listingUrls: string[] = [];
	try {
		listingUrls = await collectListingUrls(page, args.url, args.max);
		console.log(`  Found ${listingUrls.length} listing(s).\n`);
	} catch (err) {
		console.error('✖ Failed to collect listings:', (err as Error).message);
		await context.close();
		process.exit(1);
	}

	// Group normalized offers into models keyed by slug.
	const models = new Map<string, CarModel>();
	let scraped = 0;
	let skipped = 0;

	for (const url of listingUrls) {
		try {
			const raw = await scrapeListing(page, url);
			const result = normalize(raw);
			if (!result) {
				skipped++;
				console.log(`  – skipped (no price/title): ${url}`);
				continue;
			}
			scraped++;
			const slug = buildSlug(result.identity);
			let model = models.get(slug);
			if (!model) {
				model = {
					...buildModelScaffold(result.identity, {
						bodyType: result.bodyType,
						imageUrl: result.imageUrl
					}),
					offers: []
				};
				models.set(slug, model);
			}
			model.offers.push(result.offer);
			console.log(`  ✓ ${model.name}  —  CHF ${result.offer.price.toLocaleString('de-CH')}`);
		} catch (err) {
			skipped++;
			console.log(`  – skipped (error): ${url} — ${(err as Error).message}`);
		}
		await humanDelay(page); // pause between listings to avoid rapid-fire requests
	}

	await context.close();

	console.log(`\n  Parsed ${scraped} offer(s) into ${models.size} model(s); skipped ${skipped}.`);

	if (args.dry) {
		console.log('\n--- DRY RUN: would upsert ---');
		for (const m of models.values()) {
			console.log(JSON.stringify({ slug: m.slug, name: m.name, offers: m.offers.length }, null, 2));
		}
		console.log('\nNothing written (--dry).');
		return;
	}

	console.log('\n▶ Upserting into MongoDB…');
	for (const model of models.values()) {
		const r = await upsertModel(model);
		const tag = r.created ? 'created' : 'updated';
		console.log(
			`  ${tag}: ${model.slug}  (+${r.addedOffers} new, ~${r.updatedOffers} refreshed, ${r.totalOffers} total)`
		);
	}
	await closeDb();
	console.log('\n✔ Done.');
}

main().catch(async (err) => {
	console.error(err);
	await closeDb().catch(() => {});
	process.exit(1);
});
