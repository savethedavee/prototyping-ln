/**
 * Offline calibration test: parse saved AS24 listing HTML and run `normalize`
 * against it — no browser / no Cloudflare needed.
 *
 *   npm run verify
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { normalize, type Normalized } from './normalize.js';
import type { RawScrape } from './scrape.js';

/** Build a RawScrape from a saved template file, like scrapeListing would. */
function loadTemplate(file: string): RawScrape {
	const path = fileURLToPath(new URL(`../${file}`, import.meta.url));
	const html = readFileSync(path, 'utf-8');

	// Pull every JSON-LD block, exactly like scrapeListing does in the browser.
	const jsonLd: unknown[] = [];
	const re = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
	for (let m; (m = re.exec(html)); ) {
		try {
			jsonLd.push(JSON.parse(m[1]));
		} catch {
			/* ignore malformed */
		}
	}

	// h1 title (fallback path; JSON-LD `name` should win anyway).
	const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
	const title = h1?.[1].replace(/<[^>]+>/g, '').trim();

	return {
		url: `https://www.autoscout24.ch/de/d/${file}-20499186`,
		title,
		priceText: undefined,
		specs: {},
		images: [],
		dealer: undefined,
		location: undefined,
		breadcrumbs: [],
		jsonLd,
		equipment: extractEquipment(html)
	};
}

/** Pull equipment labels out of the saved #expandable-equipment section. */
function extractEquipment(html: string): string[] {
	const i = html.indexOf('id="expandable-equipment"');
	if (i < 0) return [];
	const enders = ['Motorfahrzeugkontrolle', 'Fahrzeugbeschreibung', 'Versicherung', 'Garantie'];
	const end = Math.min(...enders.map((t) => {
		const x = html.indexOf(t, i);
		return x < 0 ? html.length : x;
	}));
	const skip = /css-|^id=|^@media|mehr anzeigen|arrow down|^(zusätzliche|serienmässige|optionale) ausstattung$/i;
	return [
		...new Set(
			html
				.slice(i, end)
				.replace(/<style[\s\S]*?<\/style>/g, ' ')
				.replace(/<[^>]+>/g, '\n')
				.split('\n')
				.map((s) => s.trim())
				.filter((s) => s.length > 1 && s.length < 60 && !skip.test(s))
		)
	];
}

let failed = 0;
function check(name: string, ok: boolean) {
	console.log(`${ok ? '✓' : '✗'} ${name}`);
	if (!ok) failed++;
}

function parse(file: string): Normalized {
	const result = normalize(loadTemplate(file));
	if (!result) {
		console.error(`\n✖ normalize() returned undefined for ${file}`);
		process.exit(1);
	}
	return result;
}

// --- template.html : full BMW X3 listing -------------------------------------
console.log('=== template.html (BMW X3) ===');
{
	const { identity, offer: o } = parse('template.html');
	check('brand parsed', identity.brand.toLowerCase() === 'bmw');
	check('model parsed', identity.model.toUpperCase().startsWith('X3'));
	check('price', o.price === 53900);
	check('condition used', o.condition === 'used');
	check('mileage', o.mileage === 9050);
	check('year', o.year === 2025);
	check('color', o.color === 'black');
	check('bodyType suv', o.bodyType === 'suv');
	check('drivetrain hybrid', o.drivetrain === 'hybrid');
	check('transmission automatic', o.transmission === 'automatic');
	check('power 208 PS', o.power === 208);
	check('seats 5', o.seats === 5);
	check('dealer', o.dealer === 'I.B.A. Automobile AG');
	check('location', o.location === 'Niederlenz');
	check('listingId', o.listingId === '20499186');
	check('has images', !!o.images?.length);
}

// --- template_kleinwagen.html : Peugeot 208 (AS24 bodyType "small-car") -------
console.log('\n=== template_kleinwagen.html (Peugeot 208) ===');
{
	const { identity, offer: o } = parse('template_kleinwagen.html');
	check('brand Peugeot', identity.brand.toLowerCase() === 'peugeot');
	check('bodyType kleinwagen', o.bodyType === 'kleinwagen');
	console.log('  bodyType =', o.bodyType ?? 'undefined');
}

// --- template_coupe.html : Mercedes-AMG GT (AS24 bodyType "coupe") ------------
console.log('\n=== template_coupe.html (Mercedes-AMG GT) ===');
{
	const { offer: o } = parse('template_coupe.html');
	check('bodyType coupe', o.bodyType === 'coupe');
	check('consumption 9.6', o.consumption === 9.6);
	check('co2 224', o.co2 === 224);
	// Equipment mapping: the saved page lists Klimaanlage, Teil-Ledersitze,
	// Spurhalteassistent → climate / leather / laneAssist.
	const f = o.features ?? [];
	check('features erkannt', f.length > 0);
	check('feature climate', f.includes('climate'));
	check('feature leather', f.includes('leather'));
	check('feature laneAssist', f.includes('laneAssist'));
	console.log('  bodyType =', o.bodyType ?? 'undefined');
	console.log('  consumption/co2 =', o.consumption, '/', o.co2);
	console.log('  features =', f.join(', ') || '—');
}

// --- template_cabrio.html : Mercedes-AMG GT Roadster (AS24 "cabriolet") -------
console.log('\n=== template_cabrio.html (Mercedes-AMG GT Roadster) ===');
{
	const { offer: o } = parse('template_cabrio.html');
	check('bodyType cabrio', o.bodyType === 'cabrio');
	check('consumption 12.6', o.consumption === 12.6);
	check('co2 287', o.co2 === 287);
	console.log('  bodyType =', o.bodyType ?? 'undefined');
	console.log('  consumption/co2 =', o.consumption, '/', o.co2);
}

console.log(`\n${failed === 0 ? '✔ all passed' : `✖ ${failed} failed`}`);
process.exit(failed === 0 ? 0 : 1);
