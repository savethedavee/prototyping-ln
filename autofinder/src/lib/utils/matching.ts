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
        brands: {brands: ['BMW', 'Audi', 'Mercedes', 'Cupra', 'Tesla'], points: 5},
    },
};

export function matchScore(car: CarModel, inputs: SearchInputs): number {
    const relevant = getRelevantOffers(car, inputs);
    if (relevant.length === 0) return 0;
    if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) return 0;

    const profile = buildOfferProfile(relevant);

    let score = 15                                      // Basis
        + scoreForUsage(car, profile, inputs)   // bis 40 Punkte
        + scoreForFeatures(profile, inputs)     // bis 15 Punkte
        + scoreForBrand(car, inputs)            // bis 10 Punkte
        + scoreForPriorities(profile, inputs)   // bis 10 Punkte
        + scoreForBudget(car, inputs)           // bis  5 Punkte
        + scoreForColor(profile, inputs);

    return Math.min(100, score);
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
    if (inputs.usage.length === 0) return 20;
    const total = inputs.usage.reduce((sum, u) => sum + evaluateUsage(car, profile, u), 0);
    return Math.min(40, Math.round(total / inputs.usage.length));
}

function scoreForFeatures(profile: OfferProfile, inputs: SearchInputs): number {
    if (inputs.features.length > 0) {
        const matches = inputs.features.filter((f) => profile.features.includes(f)).length;
        return Math.round((matches / inputs.features.length) * 15);
    }
    return Math.min(10, Math.round(profile.features.length * 0.8));
}

function scoreForBrand(car: CarModel, inputs: SearchInputs): number {
    if (inputs.brands && inputs.brands.length > 0 && inputs.brands.includes(car.brand)) return 10;
    return 0;
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

function scoreForColor(profile: OfferProfile, inputs: SearchInputs): number {
    if (inputs.colors.length === 0) return 0;
    return inputs.colors.some((c) => profile.colors.includes(c)) ? 5 : 0;
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
