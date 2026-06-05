/**
 * Prints a coverage report of the cars collection so you can see which
 * matching dimensions are well-stocked and where to scrape more.
 *
 *   npm run coverage
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import type { CarModel } from './types.js';

const PRICE_BANDS: { label: string; min: number; max: number }[] = [
	{ label: '<15k', min: 0, max: 15_000 },
	{ label: '15–40k', min: 15_000, max: 40_000 },
	{ label: '40–70k', min: 40_000, max: 70_000 },
	{ label: '>70k', min: 70_000, max: Infinity }
];

const BODY_TYPES = ['suv', 'kombi', 'limousine', 'kompakt', 'kleinwagen', 'van'];
const DRIVETRAINS = ['combustion', 'hybrid', 'electric'];
const CONDITIONS = ['used', 'new'];
const REGIONS = ['europe', 'asia', 'america'];

/** Render an ordered tally as "key N · key N", flagging empty buckets. */
function line(counts: Record<string, number>, order: string[]): string {
	const parts = order.map((k) => {
		const n = counts[k] ?? 0;
		return n === 0 ? `${k} 0 ⚠` : `${k} ${n}`;
	});
	// Append any keys not in the predefined order (e.g. missing/unknown values).
	for (const k of Object.keys(counts)) {
		if (!order.includes(k)) parts.push(`${k} ${counts[k]}`);
	}
	return parts.join(' · ');
}

function bump(map: Record<string, number>, key: string | undefined) {
	const k = key ?? '—';
	map[k] = (map[k] ?? 0) + 1;
}

async function main() {
	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI not set — copy .env.example to .env and fill it in');

	const client = new MongoClient(uri);
	await client.connect();
	const col = client
		.db(process.env.MONGODB_DB || 'autofinder')
		.collection<CarModel>('cars');

	const models = await col.find({}).toArray();

	let offerCount = 0;
	const bodyType: Record<string, number> = {};
	const drivetrain: Record<string, number> = {};
	const condition: Record<string, number> = {};
	const region: Record<string, number> = {};
	const price: Record<string, number> = {};
	const modelsWithNew = new Set<string>();

	for (const m of models) {
		bump(region, m.region);
		for (const o of m.offers ?? []) {
			offerCount++;
			bump(bodyType, o.bodyType);
			bump(drivetrain, o.drivetrain);
			bump(condition, o.condition);
			if (o.condition === 'new') modelsWithNew.add(m.slug);
			const band = PRICE_BANDS.find((b) => o.price >= b.min && o.price < b.max);
			bump(price, band?.label ?? '—');
		}
	}

	console.log(`\n  ${models.length} models · ${offerCount} offers\n`);
	console.log(`  bodyType:   ${line(bodyType, BODY_TYPES)}`);
	console.log(`  drivetrain: ${line(drivetrain, DRIVETRAINS)}`);
	console.log(`  condition:  ${line(condition, CONDITIONS)}`);
	console.log(`  region:     ${line(region, REGIONS)}  (per model)`);
	console.log(`  price:      ${line(price, PRICE_BANDS.map((b) => b.label))}`);
	console.log(`\n  ${modelsWithNew.size} model(s) have at least one 'new' offer\n`);

	await client.close();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
