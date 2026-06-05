import type { BodyType, CarOffer } from './types.js';
import type { ModelIdentity } from './model.js';
import type { RawScrape } from './scrape.js';

export interface Normalized {
	offer: CarOffer;
	identity: ModelIdentity;
	bodyType?: BodyType;
	imageUrl?: string;
}

// Known multi-word brands so title parsing splits brand vs. model correctly.
const KNOWN_BRANDS = [
	'mercedes-benz',
	'alfa romeo',
	'land rover',
	'aston martin',
	'rolls-royce',
	'range rover'
];

// Order matters: hybrid is checked before electric, because hybrid listings
// (e.g. "Mild-Hybrid Benzin/Elektro") also contain the word "Elektro".
const FUEL_MAP: { match: RegExp; value: NonNullable<CarOffer['drivetrain']> }[] = [
	{ match: /hybrid|plug/i, value: 'hybrid' },
	{ match: /elektro|electric/i, value: 'electric' },
	{ match: /benzin|diesel|petrol|gas|cng|lpg|ethanol/i, value: 'combustion' }
];

const TRANSMISSION_MAP: { match: RegExp; value: NonNullable<CarOffer['transmission']> }[] = [
	{ match: /doppelkupplung|dkg|dsg|dct|s tronic|pdk/i, value: 'dct' },
	{ match: /automat|automatic|tiptronic|wandler/i, value: 'automatic' },
	{ match: /schalt|manuell|manual/i, value: 'manual' }
];

// AS24's JSON-LD `bodyType` uses English-ish values ("suv", "small-car",
// "station-wagon", "saloon", …). Order matters — first match wins.
const BODY_MAP: { match: RegExp; value: BodyType }[] = [
	{ match: /suv|geländewagen|gelaendewagen|off.?road|pick.?up/i, value: 'suv' },
	{ match: /kombi|station.?wagon|estate/i, value: 'kombi' },
	{ match: /van|bus|kleinbus|monospace|kompaktvan|mpv|minivan|multivan|people.?carrier/i, value: 'van' },
	{ match: /kleinwagen|small.?car|micro.?car|city.?car|micro/i, value: 'kleinwagen' },
	// Cabrio before coupe so a "coupe-cabriolet" is treated as a convertible.
	{ match: /cabrio|cabriolet|convertible|roadster/i, value: 'cabrio' },
	{ match: /coupé|coupe/i, value: 'coupe' },
	{ match: /limousine|sedan|saloon/i, value: 'limousine' },
	{ match: /kompakt|compact|sport/i, value: 'kompakt' }
];

// Maps AS24 equipment labels (German, free text) to the app's feature keys.
// An equipment item can match several keys; all matches are collected.
const FEATURE_MAP: { match: RegExp; key: string }[] = [
	{ match: /klimaanlage|klimaautomatik|klimatis|klima\b/i, key: 'climate' },
	{ match: /carplay|android auto|apple car/i, key: 'carplay' },
	{ match: /navigation|navi\b|navigationssystem/i, key: 'navigation' },
	{ match: /360|surround|rundumsicht|umgebungskamera|bird.?view/i, key: 'surroundCam' },
	{ match: /rückfahrkamera|rueckfahrkamera|rückfahr|reversing camera|backup camera/i, key: 'rearCam' },
	{ match: /adaptiv.*tempomat|abstandstempomat|abstandsregel|abstandswarn|acc\b|adaptive cruise/i, key: 'adaptiveCruise' },
	{ match: /spurhalte|spurassistent|spurwechsel|lane (keep|assist|departure)/i, key: 'laneAssist' },
	{ match: /sitzheizung|seat heating/i, key: 'seatHeating' },
	{ match: /leder|alcantara|leather/i, key: 'leather' },
	{ match: /sportsitz|sport seat|schalensitz/i, key: 'sportSeats' },
	{ match: /induktiv|wireless charg|kabellos.*lad|qi.?lad/i, key: 'wirelessCharging' },
	{ match: /einparkhilfe|einpark|parksensor|parkpilot|park distance|parkassist|pdc\b|parktronic/i, key: 'parkAssist' },
	{ match: /anhängerkupplung|anhaengerkupplung|anhänger|ahk\b|tow.?(bar|hitch)/i, key: 'towHitch' },
	{ match: /dachreling|dachträger|dachtraeger|roof rail/i, key: 'roofRails' },
	{ match: /allrad|4x4|4motion|quattro|xdrive|4matic|all.?wheel|awd\b/i, key: 'awd' },
	{ match: /head.?up/i, key: 'hud' }
];

/** Map raw equipment labels to the app's feature keys (deduplicated). */
function mapFeatures(equipment: string[] | undefined): string[] | undefined {
	if (!equipment?.length) return undefined;
	const keys = new Set<string>();
	for (const item of equipment) {
		for (const { match, key } of FEATURE_MAP) {
			if (match.test(item)) keys.add(key);
		}
	}
	return keys.size ? [...keys] : undefined;
}

/** Coerce a JSON-LD value (string or number) into a number. */
function num(s: string | number | undefined | null): number | undefined {
	if (s == null) return undefined;
	if (typeof s === 'number') return Number.isFinite(s) ? s : undefined;
	// "12'500 km" / "12.500" / "12,500" → 12500 ; keep first number group
	const cleaned = s.replace(/[^0-9.,']/g, ' ').trim().split(/\s+/)[0] ?? '';
	const digits = cleaned.replace(/['.,](?=\d{3}\b)/g, '').replace(/,/g, '.');
	const n = parseFloat(digits);
	return Number.isFinite(n) ? n : undefined;
}

/** First spec value whose label matches any of the given substrings. */
function spec(specs: Record<string, string>, ...labels: string[]): string | undefined {
	for (const [k, v] of Object.entries(specs)) {
		if (labels.some((l) => k.includes(l))) return v;
	}
	return undefined;
}

function mapBy<T>(maps: { match: RegExp; value: T }[], text?: string): T | undefined {
	if (!text) return undefined;
	for (const m of maps) if (m.match.test(text)) return m.value;
	return undefined;
}

/**
 * Deep-walk the JSON-LD graph and return the first vehicle node. AS24 nests the
 * `Car` deep inside an `Organization` (`hasOfferCatalog.itemListElement.itemOffered`),
 * so we must descend into every property, not just `@graph`.
 */
function findVehicleNode(jsonLd: unknown[]): Record<string, any> | undefined {
	let found: Record<string, any> | undefined;
	const visit = (v: unknown) => {
		if (found) return;
		if (Array.isArray(v)) {
			for (const x of v) {
				visit(x);
				if (found) return;
			}
			return;
		}
		if (v && typeof v === 'object') {
			const o = v as Record<string, any>;
			const t = ([] as string[]).concat(o['@type'] ?? []).join(' ').toLowerCase();
			if (/car|vehicle|product/.test(t)) {
				found = o;
				return;
			}
			for (const k of Object.keys(o)) {
				visit(o[k]);
				if (found) return;
			}
		}
	};
	visit(jsonLd);
	return found;
}

/** The (first) Offer object attached to a vehicle node. */
function offerOf(node: Record<string, any> | undefined): Record<string, any> | undefined {
	const o = node?.offers;
	return Array.isArray(o) ? o[0] : o;
}

/** Read a string from a JSON-LD value: plain string, number, or `{ name }` object. */
function ldStr(v: unknown): string | undefined {
	if (typeof v === 'string') return v.trim() || undefined;
	if (typeof v === 'number') return String(v);
	if (v && typeof v === 'object' && typeof (v as any).name === 'string') {
		return (v as any).name.trim() || undefined;
	}
	return undefined;
}

/** Engine power in PS, converting from kW if the unit says so. */
function powerPs(node: Record<string, any> | undefined): number | undefined {
	const ep = node?.vehicleEngine?.enginePower;
	const v = num(Array.isArray(ep) ? ep[0]?.value : ep?.value);
	if (v == null) return undefined;
	const unit = String(
		(Array.isArray(ep) ? ep[0] : ep)?.unitText ?? (Array.isArray(ep) ? ep[0] : ep)?.unitCode ?? ''
	).toLowerCase();
	return /kw|kwt/.test(unit) ? Math.round(v * 1.35962) : Math.round(v);
}

/** schema.org itemCondition / German "Zustand" → condition. Defaults to 'used'. */
function mapCondition(...candidates: (string | undefined)[]): CarOffer['condition'] {
	const s = candidates.find(Boolean);
	if (!s) return 'used';
	if (/newcondition|neufahrzeug|neuwagen|fabrikneu|^\s*neu\b/i.test(s)) return 'new';
	return 'used';
}

/** Full-size image URLs from JSON-LD (preferred) or the raw DOM scrape. */
function collectImages(node: Record<string, any> | undefined, raw: RawScrape): string[] {
	const fromLd = ([] as unknown[])
		.concat(node?.image ?? [])
		.map((u) => ldStr(u))
		.filter((u): u is string => !!u)
		// strip the thumbnail query (?width=96&q=90) to get the full-size asset
		.map((u) => u.split('?')[0]);
	const all = fromLd.length ? fromLd : raw.images;
	return Array.from(new Set(all)).slice(0, 10);
}

/** Split a listing title into brand + model + version using known brands. */
function parseIdentity(title: string, jsonLdBrand?: string, jsonLdModel?: string): ModelIdentity {
	const clean = title.replace(/\s+/g, ' ').trim();
	const lower = clean.toLowerCase();

	let brand = jsonLdBrand?.trim();
	if (!brand) {
		brand = KNOWN_BRANDS.find((b) => lower.startsWith(b));
		if (!brand) brand = clean.split(' ')[0];
	}

	// Remainder after the brand.
	let rest = clean;
	if (lower.startsWith(brand.toLowerCase())) rest = clean.slice(brand.length).trim();

	const restTokens = rest.split(' ').filter(Boolean);
	// Model = JSON-LD model if it is a prefix of the remainder, else first 1–2 tokens.
	let model = jsonLdModel?.trim();
	if (!model || !rest.toLowerCase().startsWith(model.toLowerCase())) {
		// Heuristic: take first token, plus a second if it is a short alphanumeric code (e.g. "C 200").
		model = restTokens[0] ?? '';
		if (restTokens[1] && /^[a-z0-9]{1,4}$/i.test(restTokens[1])) model += ' ' + restTokens[1];
	}

	const version = rest.slice(model.length).trim() || undefined;
	return { brand: brand.trim(), model: model.trim(), version };
}

/** Pull the AS24 listing id from the detail URL (…-<digits> at the end). */
function listingIdFromUrl(url: string): string | undefined {
	const m = url.match(/-(\d{5,})(?:\/)?$/) ?? url.match(/(\d{6,})(?:\/)?$/);
	return m?.[1];
}

export function normalize(raw: RawScrape): Normalized | undefined {
	const node = findVehicleNode(raw.jsonLd);
	const offer = offerOf(node);
	const seller = offer?.seller;

	const title = ldStr(node?.name) ?? raw.title ?? '';
	if (!title) return undefined;

	const price = num(offer?.price) ?? num(raw.priceText);
	if (!price) return undefined; // a listing without a price is not usable

	const fuelText =
		ldStr(node?.vehicleEngine?.fuelType) ?? spec(raw.specs, 'treibstoff', 'kraftstoff');
	const transText =
		ldStr(node?.vehicleTransmission) ?? spec(raw.specs, 'getriebe', 'schaltung');
	const bodyText =
		ldStr(node?.bodyType) ??
		spec(raw.specs, 'karosserie', 'fahrzeugkategorie', 'aufbau', 'kategorie');

	const condition = mapCondition(
		ldStr(offer?.itemCondition),
		ldStr(node?.itemCondition),
		spec(raw.specs, 'zustand', 'fahrzeugzustand')
	);

	const bodyType = mapBy(BODY_MAP, bodyText);

	const carOffer: CarOffer = {
		condition,
		price,
		mileage: num(node?.mileageFromOdometer?.value ?? spec(raw.specs, 'kilometer', 'km-stand', 'laufleistung')),
		color: ldStr(node?.color) ?? spec(raw.specs, 'farbe', 'aussenfarbe'),
		bodyType,
		drivetrain: mapBy(FUEL_MAP, fuelText),
		transmission: mapBy(TRANSMISSION_MAP, transText),
		power: powerPs(node) ?? num(spec(raw.specs, 'leistung', ' ps', 'kw')),
		consumption: num(spec(raw.specs, 'verbrauch')),
		co2: num(spec(raw.specs, 'co2', 'co₂')),
		seats: num(node?.vehicleSeatingCapacity ?? spec(raw.specs, 'sitzplätze', 'plätze', 'sitze')),
		trunkSize: num(spec(raw.specs, 'kofferraum')),
		year: num(
			node?.vehicleModelDate ??
				node?.productionDate ??
				spec(raw.specs, 'inverkehr', 'erstzulassung', 'jahrgang', 'jahr')
		),
		features: mapFeatures(raw.equipment),
		url: ldStr(node?.url) ?? raw.url,
		images: undefined,
		platform: 'autoscout24',
		listingId: listingIdFromUrl(ldStr(node?.url) ?? raw.url),
		dealer: ldStr(seller) ?? raw.dealer,
		location: ldStr(seller?.address?.addressLocality) ?? raw.location
	};

	const images = collectImages(node, raw);
	if (images.length) carOffer.images = images;

	// Drop undefined keys to keep documents clean.
	for (const k of Object.keys(carOffer) as (keyof CarOffer)[]) {
		if (carOffer[k] === undefined) delete carOffer[k];
	}

	const identity = parseIdentity(title, ldStr(node?.brand), ldStr(node?.model));

	return { offer: carOffer, identity, bodyType, imageUrl: images[0] };
}
