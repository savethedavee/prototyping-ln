import type { CarModel, CarOffer, SearchInputs } from '$lib/types';

export function getRelevantOffers(car: CarModel, inputs: SearchInputs): CarOffer[] {
	return car.offers.filter((offer) => {
		if (inputs.condition !== 'any' && offer.condition !== inputs.condition) return false;
		if (inputs.budgetMax < 100000 && offer.price > inputs.budgetMax) return false;
		if (offer.price < inputs.budgetMin) return false;
		return true;
	});
}

export function getMinPrice(car: CarModel, condition: 'new' | 'used' | 'any' = 'any'): number | undefined {
	const relevant = condition === 'any' ? car.offers : car.offers.filter((o) => o.condition === condition);
	if (relevant.length === 0) return undefined;
	return Math.min(...relevant.map((o) => o.price));
}

// --- Usage scoring ---

type DrivetrainCriteria = {
	electric?: number;
	hybrid?: number;
	combustionIf?: { consumptionMax: number; points: number };
	default?: number;
};

type UsageCriteria = {
	maxScore: number;
	drivetrain?: DrivetrainCriteria;
	seats?:    { min: number; points: number }[];
	trunk?:    { min: number; points: number }[];
	power?:    { min: number; points: number }[];
	features?: { any: string[]; points: number }[];
	carType?:  { types: string[]; points: number };
	brands?:   { brands: string[]; points: number };
};

const USAGE_CRITERIA: Record<string, UsageCriteria> = {
	commute: {
		maxScore:  40,
		drivetrain: {
			electric:     40,
			hybrid:       30,
			combustionIf: { consumptionMax: 5.5, points: 20 },
			default:      10,
		},
	},
	family: {
		maxScore: 40,
		seats:    [{ min: 7, points: 15 }, { min: 5, points: 8 }],
		trunk:    [{ min: 550, points: 15 }, { min: 400, points: 8 }, { min: 300, points: 3 }],
		features: [
			{ any: ['laneAssist', 'adaptiveCruise'], points: 7 },
			{ any: ['rearCam'],                      points: 3 },
			{ any: ['seatHeating'],                  points: 2 },
		],
	},
	leisure: {
		maxScore: 40,
		trunk:    [{ min: 550, points: 15 }, { min: 400, points: 8 }],
		features: [
			{ any: ['towHitch'],  points: 12 },
			{ any: ['roofRails'], points:  8 },
			{ any: ['awd'],       points:  5 },
		],
	},
	city: {
		maxScore:  40,
		drivetrain: { electric: 20, hybrid: 10 },
		features:  [{ any: ['parkAssist', 'surroundCam'], points: 10 }],
		carType:   { types: ['Kleinwagen', 'Kompaktwagen'], points: 10 },
	},
	commercial: {
		maxScore: 40,
		features: [{ any: ['towHitch'], points: 20 }],
		trunk:    [{ min: 550, points: 12 }, { min: 400, points: 6 }],
		power:    [{ min: 150, points: 8 }],
	},
	sport: {
		maxScore: 40,
		power:    [{ min: 280, points: 20 }, { min: 200, points: 12 }, { min: 150, points: 5 }],
		features: [
			{ any: ['sportSeats'], points: 10 },
			{ any: ['leather'],    points:  5 },
		],
		brands: { brands: ['BMW', 'Audi', 'Mercedes', 'Cupra', 'Tesla'], points: 5 },
	},
};

function evaluateUsageCriteria(car: CarModel, c: UsageCriteria): number {
	let score = 0;

	if (c.drivetrain) {
		const d = c.drivetrain;
		if (car.drivetrain === 'electric' && d.electric !== undefined)                       score += d.electric;
		else if (car.drivetrain === 'hybrid' && d.hybrid !== undefined)                      score += d.hybrid;
		else if (d.combustionIf && car.consumption <= d.combustionIf.consumptionMax)         score += d.combustionIf.points;
		else if (d.default !== undefined)                                                     score += d.default;
	}

	if (c.seats)  { const t = c.seats.find((t) => car.seats     >= t.min); if (t) score += t.points; }
	if (c.trunk)  { const t = c.trunk.find((t) => car.trunkSize >= t.min); if (t) score += t.points; }
	if (c.power)  { const t = c.power.find((t) => car.power     >= t.min); if (t) score += t.points; }

	if (c.features) {
		for (const group of c.features) {
			if (group.any.some((f) => car.features.includes(f))) score += group.points;
		}
	}

	if (c.carType && c.carType.types.includes(car.type))     score += c.carType.points;
	if (c.brands  && c.brands.brands.includes(car.brand))    score += c.brands.points;

	return Math.min(c.maxScore, score);
}

function scoreForUsage(car: CarModel, usage: string): number {
	const criteria = USAGE_CRITERIA[usage];
	return criteria ? evaluateUsageCriteria(car, criteria) : 20;
}

// --- Main match score ---

export function matchScore(car: CarModel, inputs: SearchInputs): number {
	// Harte Filter
	if (getRelevantOffers(car, inputs).length === 0) return 0;
	if (inputs.drivetrain.length > 0 && !inputs.drivetrain.includes(car.drivetrain)) return 0;
	if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) return 0;
	if (inputs.bodyTypes.length > 0 && !inputs.bodyTypes.includes(car.bodyType)) return 0;

	let score = 15; // Basis

	// 1) Nutzung — stärkste Gewichtung (bis 40 Punkte)
	if (inputs.usage.length > 0) {
		const total = inputs.usage.reduce((sum, u) => sum + scoreForUsage(car, u), 0);
		score += Math.min(40, Math.round(total / inputs.usage.length));
	} else {
		score += 20; // neutral
	}

	// 2) Ausstattung (bis 15 Punkte)
	if (inputs.features.length > 0) {
		const matches = inputs.features.filter((f) => car.features.includes(f)).length;
		score += Math.round((matches / inputs.features.length) * 15);
	} else {
		score += Math.min(10, Math.round(car.features.length * 0.8));
	}

	// 3) Marke (bis 10 Punkte)
	if (inputs.brands && inputs.brands.length > 0 && inputs.brands.includes(car.brand)) {
		score += 10;
	}

	// 4) Prioritäten (bis 10 Punkte)
	if (inputs.priorities.consumption >= 4) {
		if (car.drivetrain === 'electric') score += 6;
		else if (car.drivetrain === 'hybrid') score += 3;
	}
	if (inputs.priorities.power >= 4 && car.power >= 200) score += 4;

	// 5) Budget-Passgenauigkeit (bis 5 Punkte)
	const minPrice = getMinPrice(car, inputs.condition) ?? 0;
	const withinMax = inputs.budgetMax >= 100000 || minPrice <= inputs.budgetMax;
	if (minPrice >= inputs.budgetMin && withinMax) score += 5;

	// 6) Farbe (bis 5 Punkte)
	if (inputs.colors.length > 0) {
		const colorMatch = inputs.colors.some((c) => car.colors.includes(c));
		if (colorMatch) score += 5;
	}

	return Math.min(100, score);
}
