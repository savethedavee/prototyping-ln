import type { BodyType, CarModel } from './types.js';

/** Brand → manufacturer region. Lowercase brand keys. Unknown → 'europe'. */
const BRAND_REGION: Record<string, CarModel['region']> = {
	// Europe
	vw: 'europe',
	volkswagen: 'europe',
	audi: 'europe',
	bmw: 'europe',
	mercedes: 'europe',
	'mercedes-benz': 'europe',
	porsche: 'europe',
	opel: 'europe',
	skoda: 'europe',
	seat: 'europe',
	cupra: 'europe',
	volvo: 'europe',
	renault: 'europe',
	peugeot: 'europe',
	citroen: 'europe',
	'ds': 'europe',
	fiat: 'europe',
	'alfa romeo': 'europe',
	lancia: 'europe',
	'mini': 'europe',
	smart: 'europe',
	dacia: 'europe',
	jaguar: 'europe',
	'land rover': 'europe',
	'range rover': 'europe',
	maserati: 'europe',
	'ferrari': 'europe',
	lamborghini: 'europe',
	bentley: 'europe',
	'aston martin': 'europe',
	// Asia
	toyota: 'asia',
	lexus: 'asia',
	honda: 'asia',
	mazda: 'asia',
	nissan: 'asia',
	subaru: 'asia',
	mitsubishi: 'asia',
	suzuki: 'asia',
	hyundai: 'asia',
	kia: 'asia',
	genesis: 'asia',
	byd: 'asia',
	'mg': 'asia',
	// America
	ford: 'america',
	chevrolet: 'america',
	jeep: 'america',
	dodge: 'america',
	chrysler: 'america',
	cadillac: 'america',
	tesla: 'america'
};

/** bodyType → German label for CarModel.type. */
const BODY_TYPE_LABEL: Record<BodyType, string> = {
	suv: 'SUV',
	kombi: 'Kombi',
	limousine: 'Limousine',
	kompakt: 'Kompaktklasse',
	kleinwagen: 'Kleinwagen',
	van: 'Van'
};

export interface ModelIdentity {
	brand: string; // raw, display-cased (e.g. "Mercedes-Benz")
	model: string; // e.g. "C 200"
	version?: string; // e.g. "AMG Line", "GTI"
}

export function regionForBrand(brand: string): CarModel['region'] {
	return BRAND_REGION[brand.trim().toLowerCase()] ?? 'europe';
}

export function typeForBodyType(bodyType?: BodyType): string {
	return bodyType ? BODY_TYPE_LABEL[bodyType] : 'Fahrzeug';
}

/** kebab-case slug from brand + model + version (variant-level grouping). */
export function buildSlug(id: ModelIdentity): string {
	return [id.brand, id.model, id.version]
		.filter(Boolean)
		.join(' ')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '') // strip accents
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function displayName(id: ModelIdentity): string {
	return [id.brand, id.model, id.version].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Builds the model-level scaffold (no offers). Offers are attached by the
 * orchestrator. Missing data falls back to sensible defaults.
 */
export function buildModelScaffold(
	id: ModelIdentity,
	opts: { bodyType?: BodyType; imageUrl?: string }
): Omit<CarModel, 'offers'> {
	const name = displayName(id);
	const type = typeForBodyType(opts.bodyType);

	return {
		slug: buildSlug(id),
		name,
		brand: id.brand,
		type,
		region: regionForBrand(id.brand),
		warranty: 0, // unknown from a listing — default until enriched
		imageUrl: opts.imageUrl,
		description: `${name} — automatisch importiertes Angebot von AutoScout24.`,
		detailText: `Für den ${name} liegen aktuell Inserate von AutoScout24 vor. Die technischen Angaben stammen direkt aus den Inseraten; einzelne Werte können fehlen.`
	};
}
