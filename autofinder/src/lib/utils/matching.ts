import type {CarModel, CarOffer, SearchInputs} from '$lib/types';

type OfferProfile = {
    drivetrains: string[];
    bodyTypes: string[];
    features: string[];
    maxPower: number;
    minConsumption: number;
    maxSeats: number;
    maxTrunkSize: number;
    colors: string[];
};

type DrivetrainCriteria = {
    electric?: number;
    hybrid?: number;
    combustionIf?: { consumptionMax: number; points: number };
    default?: number;
};

type UsageCriteria = {
    maxScore: number;
    drivetrain?: DrivetrainCriteria;
    seats?: { min: number; points: number }[];
    trunk?: { min: number; points: number }[];
    power?: { min: number; points: number }[];
    features?: { any: string[]; points: number }[];
    carType?: { types: string[]; points: number };
    brands?: { brands: string[]; points: number };
};

const USAGE_CRITERIA: Record<string, UsageCriteria> = {
    commute: {
        maxScore: 40,
        drivetrain: {
            electric: 40,
            hybrid: 30,
            combustionIf: {consumptionMax: 5.5, points: 20},
            default: 10,
        },
    },
    family: {
        maxScore: 40,
        seats: [{min: 7, points: 15}, {min: 5, points: 8}],
        trunk: [{min: 550, points: 15}, {min: 400, points: 8}, {min: 300, points: 3}],
        features: [
            {any: ['laneAssist', 'adaptiveCruise'], points: 7},
            {any: ['rearCam'], points: 3},
            {any: ['seatHeating'], points: 2},
        ],
    },
    leisure: {
        maxScore: 40,
        trunk: [{min: 550, points: 15}, {min: 400, points: 8}],
        features: [
            {any: ['towHitch'], points: 12},
            {any: ['roofRails'], points: 8},
            {any: ['awd'], points: 5},
        ],
    },
    city: {
        maxScore: 40,
        drivetrain: {electric: 20, hybrid: 10},
        features: [{any: ['parkAssist', 'surroundCam'], points: 10}],
        carType: {types: ['Kleinwagen', 'Kompaktwagen'], points: 10},
    },
    commercial: {
        maxScore: 40,
        features: [{any: ['towHitch'], points: 20}],
        trunk: [{min: 550, points: 12}, {min: 400, points: 6}],
        power: [{min: 150, points: 8}],
    },
    sport: {
        maxScore: 40,
        power: [{min: 280, points: 20}, {min: 200, points: 12}, {min: 150, points: 5}],
        features: [
            {any: ['sportSeats'], points: 10},
            {any: ['leather'], points: 5},
        ],
        carType: {types: ['Coupé', 'Cabriolet'], points: 8},
        brands: {brands: ['BMW', 'Audi', 'Mercedes', 'Cupra', 'Tesla'], points: 5},
    },
};

export interface MatchBreakdown {
    total: number;
    base: number;        // bis 27
    usage: number;       // bis 40
    brand: number;       // bis 10
    priorities: number;  // bis 10
    budget: number;      // bis  5
    color: number;       // bis  5
    features: number;    // bis  3 (bewusst geringer Einfluss)
    relevantOffers: number;
    reason?: string;     // gesetzt, wenn ein harter Filter den Score auf 0 zwingt
}

/** Full score breakdown for a car, incl. why it scored 0 (hard filters). */
export function matchBreakdown(car: CarModel, inputs: SearchInputs): MatchBreakdown {
    const zero = { base: 0, usage: 0, brand: 0, priorities: 0, budget: 0, color: 0, features: 0 };

    const relevant = getRelevantOffers(car, inputs);
    if (relevant.length === 0) {
        return {
            total: 0,
            ...zero,
            relevantOffers: 0,
            reason: 'kein Angebot im Filter (Budget/Zustand/Antrieb/Karosserie)'
        };
    }
    if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) {
        return {
            total: 0,
            ...zero,
            relevantOffers: relevant.length,
            reason: `Region ${car.region} ≠ ${inputs.brandRegion}`
        };
    }

    const profile = buildOfferProfile(relevant);
    // Ausstattung fließt bewusst nur mit max. 3 Punkten ein (geringer Einfluss).
    // Die übrigen früheren Feature-Punkte bleiben in der Basis, damit die Skala
    // bei 0–100 bleibt: 27 + 40 + 10 + 10 + 5 + 5 + 3 = 100.
    const base = 27;
    const usage = scoreForUsage(car, profile, inputs);
    const brand = scoreForBrand(car, inputs);
    const priorities = scoreForPriorities(profile, inputs);
    const budget = scoreForBudget(car, inputs);
    const color = scoreForColor(profile, inputs);
    const features = scoreForFeatures(profile, inputs);
    const total = Math.min(100, base + usage + brand + priorities + budget + color + features);

    return { total, base, usage, brand, priorities, budget, color, features, relevantOffers: relevant.length };
}

export function matchScore(car: CarModel, inputs: SearchInputs): number {
    return matchBreakdown(car, inputs).total;
}

export interface MatchReason {
    label: string;   // kurzes Schlagwort, z.B. "Familientauglich"
    detail: string;  // konkrete Begründung, z.B. "5 Sitze, 480 L Kofferraum"
}

const DRIVETRAIN_LABEL: Record<string, string> = {
    electric: 'Elektro',
    hybrid: 'Hybrid',
    combustion: 'Verbrenner',
};

const COLOR_LABEL: Record<string, string> = {
    schwarz: 'Schwarz', weiss: 'Weiss', grau: 'Grau', silber: 'Silber',
    blau: 'Blau', rot: 'Rot', gruen: 'Grün', braun: 'Braun', beige: 'Beige',
};

/**
 * Personalisierte "Warum passt das zu dir"-Gründe, abgeleitet aus den echten
 * Eingaben des Nutzers und den (gefilterten) Angeboten. Nur Gründe, die
 * tatsächlich zutreffen, werden zurückgegeben — sonst nichts.
 */
export function matchReasons(car: CarModel, inputs: SearchInputs): MatchReason[] {
    const offers = getRelevantOffers(car, inputs);
    if (offers.length === 0) return [];
    if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) return [];

    const profile = buildOfferProfile(offers);
    const minPrice = getMinPrice(car, inputs.condition);
    const reasons: MatchReason[] = [];

    // Nutzungszwecke (nur die gewählten, und nur wenn das Modell sie erfüllt).
    for (const usage of inputs.usage) {
        const r = usageReason(usage, profile);
        if (r) reasons.push(r);
    }

    // Budget: konkret die günstigste passende Offer nennen.
    if (minPrice != null && inputs.budgetMax < 100000 && minPrice <= inputs.budgetMax) {
        reasons.push({
            label: 'Im Budget',
            detail: `ab CHF ${minPrice.toLocaleString('de-CH')} — dein Rahmen bis CHF ${inputs.budgetMax.toLocaleString('de-CH')}`,
        });
    }

    // Prioritäten.
    if (inputs.priorities.consumption >= 4 && profile.drivetrains.includes('electric')) {
        reasons.push({ label: 'Sparsam', detail: 'Elektro — passt zu deiner Priorität niedriger Verbrauch' });
    } else if (inputs.priorities.consumption >= 4 && profile.drivetrains.includes('hybrid')) {
        reasons.push({ label: 'Sparsam', detail: 'Hybrid — passt zu deiner Priorität niedriger Verbrauch' });
    }
    if (inputs.priorities.power >= 4 && profile.maxPower >= 200) {
        reasons.push({ label: 'Leistungsstark', detail: `${profile.maxPower} PS — passt zu deiner Priorität Leistung` });
    }

    // Gewünschter Antrieb (getRelevantOffers hat bereits gefiltert).
    if (inputs.drivetrain.length > 0 && profile.drivetrains.length > 0) {
        const dt = profile.drivetrains[0];
        reasons.push({ label: 'Antrieb', detail: `${DRIVETRAIN_LABEL[dt] ?? dt} — wie von dir gewünscht` });
    }

    // Wunschmarke.
    if (inputs.brands?.includes(car.brand)) {
        reasons.push({ label: 'Wunschmarke', detail: `${car.brand} gehört zu deinen bevorzugten Marken` });
    }

    // Farbe (nur wenn ein Angebot die Wunschfarbe führt).
    if (inputs.colors.length > 0) {
        const offerColors = profile.colors.map(normalizeColor);
        const match = inputs.colors.find((c) => offerColors.includes(c));
        if (match) reasons.push({ label: 'Farbe', detail: `${COLOR_LABEL[match] ?? match} verfügbar` });
    }

    return reasons.slice(0, 5);
}

function usageReason(usage: string, p: OfferProfile): MatchReason | undefined {
    switch (usage) {
        case 'family': {
            if (p.maxSeats < 5 && p.maxTrunkSize < 400) return undefined;
            const bits: string[] = [];
            if (p.maxSeats >= 5) bits.push(`${p.maxSeats} Sitze`);
            if (p.maxTrunkSize > 0) bits.push(`${p.maxTrunkSize} L Kofferraum`);
            return { label: 'Familientauglich', detail: bits.join(', ') };
        }
        case 'commute':
            if (p.drivetrains.includes('electric')) return { label: 'Gut zum Pendeln', detail: 'Elektro — günstig im Alltag' };
            if (p.drivetrains.includes('hybrid')) return { label: 'Gut zum Pendeln', detail: 'Hybrid — günstig im Alltag' };
            if (isFinite(p.minConsumption) && p.minConsumption > 0 && p.minConsumption <= 5.5)
                return { label: 'Gut zum Pendeln', detail: `sparsam mit ${p.minConsumption} L/100km` };
            return undefined;
        case 'city':
            if (p.bodyTypes.some((b) => b === 'kleinwagen' || b === 'kompakt'))
                return { label: 'Stadttauglich', detail: 'kompakte Karosserie' };
            if (p.drivetrains.includes('electric'))
                return { label: 'Stadttauglich', detail: 'Elektro — leise & lokal emissionsfrei' };
            return undefined;
        case 'leisure':
            if (p.maxTrunkSize >= 400) return { label: 'Für Freizeit & Reisen', detail: `${p.maxTrunkSize} L Gepäckraum` };
            return undefined;
        case 'commercial': {
            if (p.maxTrunkSize < 400 && p.maxPower < 150) return undefined;
            const bits: string[] = [];
            if (p.maxTrunkSize >= 400) bits.push(`${p.maxTrunkSize} L Laderaum`);
            if (p.maxPower >= 150) bits.push(`${p.maxPower} PS`);
            return { label: 'Für Gewerbe', detail: bits.join(', ') };
        }
        case 'sport':
            if (p.maxPower >= 200) return { label: 'Sportlich', detail: `${p.maxPower} PS` };
            return undefined;
        default:
            return undefined;
    }
}

export function getRelevantOffers(car: CarModel, inputs: SearchInputs): CarOffer[] {
    return car.offers.filter((offer) => {
        if (inputs.condition !== 'any' && offer.condition !== inputs.condition) return false;
        if (inputs.budgetMax < 100000 && offer.price > inputs.budgetMax) return false;
        if (offer.price < inputs.budgetMin) return false;
        if (inputs.drivetrain.length > 0 && (!offer.drivetrain || !inputs.drivetrain.includes(offer.drivetrain))) return false;
        if (inputs.bodyTypes.length > 0 && (!offer.bodyType || !inputs.bodyTypes.includes(offer.bodyType))) return false;
        return true;
    });
}

function buildOfferProfile(offers: CarOffer[]): OfferProfile {
    return {
        drivetrains: [...new Set(offers.map((o) => o.drivetrain).filter((d): d is NonNullable<typeof d> => !!d))],
        bodyTypes: [...new Set(offers.map((o) => o.bodyType).filter((b): b is NonNullable<typeof b> => !!b))],
        features: [...new Set(offers.flatMap((o) => o.features ?? []))],
        maxPower: Math.max(0, ...offers.map((o) => o.power ?? 0)),
        minConsumption: Math.min(Infinity, ...offers.map((o) => o.consumption ?? Infinity)),
        maxSeats: Math.max(0, ...offers.map((o) => o.seats ?? 0)),
        maxTrunkSize: Math.max(0, ...offers.map((o) => o.trunkSize ?? 0)),
        colors: [...new Set(offers.map((o) => o.color).filter((c): c is string => !!c))],
    };
}

function scoreForUsage(car: CarModel, profile: OfferProfile, inputs: SearchInputs): number {
    if (inputs.usage.length === 0) return 40; // kein Nutzungszweck gewählt → egal → volle Punkte
    const total = inputs.usage.reduce((sum, u) => sum + evaluateUsage(car, profile, u), 0);
    return Math.min(40, Math.round(total / inputs.usage.length));
}

function scoreForBrand(car: CarModel, inputs: SearchInputs): number {
    if (!inputs.brands || inputs.brands.length === 0) return 10; // keine Marken-Präferenz → egal → volle Punkte
    return inputs.brands.includes(car.brand) ? 10 : 0;
}

function scoreForPriorities(profile: OfferProfile, inputs: SearchInputs): number {
    let score = 0;
    if (inputs.priorities.consumption >= 4) {
        if (profile.drivetrains.includes('electric')) score += 6;
        else if (profile.drivetrains.includes('hybrid')) score += 3;
    }
    if (inputs.priorities.power >= 4 && profile.maxPower >= 200) score += 4;
    return score;
}

function scoreForBudget(car: CarModel, inputs: SearchInputs): number {
    const minPrice = getMinPrice(car, inputs.condition) ?? 0;
    const withinMax = inputs.budgetMax >= 100000 || minPrice <= inputs.budgetMax;
    return minPrice >= inputs.budgetMin && withinMax ? 5 : 0;
}

// Rohe Farbstrings (JSON-LD / Inserat) auf die Filter-Keys mappen, damit
// "Schwarz", "black", "Schwarz mét." alle als 'schwarz' zählen. Groß-/
// Kleinschreibung, Sprache und Zusätze werden so toleriert.
export function normalizeColor(raw: string): string {
    const s = raw.toLowerCase();
    if (/schwarz|black/.test(s)) return 'schwarz';
    if (/wei|white/.test(s)) return 'weiss';
    if (/silber|silver/.test(s)) return 'silber';
    if (/anthrazit|grau|grey|gray/.test(s)) return 'grau';
    if (/blau|blue/.test(s)) return 'blau';
    if (/rot|red|bordeaux/.test(s)) return 'rot';
    if (/grün|gruen|green/.test(s)) return 'gruen';
    if (/braun|brown/.test(s)) return 'braun';
    if (/beige/.test(s)) return 'beige';
    return s;
}

function scoreForColor(profile: OfferProfile, inputs: SearchInputs): number {
    if (inputs.colors.length === 0) return 5; // Farbe egal → volle Punkte
    const offerColors = profile.colors.map(normalizeColor);
    return inputs.colors.some((c) => offerColors.includes(c)) ? 5 : 0;
}

// Ausstattung mit bewusst geringem Gewicht (max. 3 Punkte). Ohne Feature-Wünsche
// neutral volle Punkte, sonst anteilig nach Trefferquote der gewünschten Features.
function scoreForFeatures(profile: OfferProfile, inputs: SearchInputs): number {
    const MAX = 3;
    if (inputs.features.length === 0) return MAX;
    const have = inputs.features.filter((f) => profile.features.includes(f)).length;
    return Math.round((have / inputs.features.length) * MAX);
}

function evaluateUsage(car: CarModel, profile: OfferProfile, usage: string): number {
    const criteria = USAGE_CRITERIA[usage];
    return criteria ? evaluateUsageCriteria(car, profile, criteria) : 20;
}

function evaluateUsageCriteria(car: CarModel, profile: OfferProfile, c: UsageCriteria): number {
    let score = 0;

    if (c.drivetrain) {
        const d = c.drivetrain;
        const dt = profile.drivetrains;
        if (dt.includes('electric') && d.electric !== undefined) score += d.electric;
        else if (dt.includes('hybrid') && d.hybrid !== undefined) score += d.hybrid;
        else if (d.combustionIf && profile.minConsumption <= d.combustionIf.consumptionMax) score += d.combustionIf.points;
        else if (d.default !== undefined) score += d.default;
    }

    if (c.seats) {
        const t = c.seats.find((t) => profile.maxSeats >= t.min);
        if (t) score += t.points;
    }
    if (c.trunk) {
        const t = c.trunk.find((t) => profile.maxTrunkSize >= t.min);
        if (t) score += t.points;
    }
    if (c.power) {
        const t = c.power.find((t) => profile.maxPower >= t.min);
        if (t) score += t.points;
    }

    if (c.features) {
        for (const group of c.features) {
            if (group.any.some((f) => profile.features.includes(f))) score += group.points;
        }
    }

    if (c.carType && c.carType.types.includes(car.type)) score += c.carType.points;
    if (c.brands && c.brands.brands.includes(car.brand)) score += c.brands.points;

    return Math.min(c.maxScore, score);
}

export function getMinPrice(car: CarModel, condition: 'new' | 'used' | 'any' = 'any'): number | undefined {
    const relevant = condition === 'any' ? car.offers : car.offers.filter((o) => o.condition === condition);
    if (relevant.length === 0) return undefined;
    return Math.min(...relevant.map((o) => o.price));
}

export function getPrimaryOffer(car: CarModel): CarOffer | undefined {
    return car.offers.find((o) => o.condition === 'new') ?? car.offers[0];
}

/** Best display image: the model image, else the first image from any offer. */
export function getImageUrl(car: CarModel): string | undefined {
    if (car.imageUrl) return car.imageUrl;
    for (const offer of car.offers) {
        if (offer.images?.length) return offer.images[0];
    }
    return undefined;
}
