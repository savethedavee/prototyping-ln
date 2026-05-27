import type { CarModel, SearchInputs } from '$lib/types';

function scoreForUsage(car: CarModel, usage: string): number {
	if (usage === 'commute') {
		// Effizienz zählt
		if (car.drivetrain === 'electric') return 40;
		if (car.drivetrain === 'hybrid') return 30;
		if (car.consumption <= 5.5) return 20;
		return 10;
	}

	if (usage === 'family') {
		// Platz, Sitze, Sicherheit
		let s = 0;
		if (car.seats >= 7) s += 15;
		else if (car.seats >= 5) s += 8;
		if (car.trunkSize >= 550) s += 15;
		else if (car.trunkSize >= 400) s += 8;
		else if (car.trunkSize >= 300) s += 3;
		if (car.features.includes('laneAssist') || car.features.includes('adaptiveCruise')) s += 7;
		if (car.features.includes('rearCam')) s += 3;
		if (car.features.includes('seatHeating')) s += 2;
		return Math.min(40, s);
	}

	if (usage === 'leisure') {
		// Kofferraum, Anhänger, Dachgepäck, AWD
		let s = 0;
		if (car.trunkSize >= 550) s += 15;
		else if (car.trunkSize >= 400) s += 8;
		if (car.features.includes('towHitch')) s += 12;
		if (car.features.includes('roofRails')) s += 8;
		if (car.features.includes('awd')) s += 5;
		return Math.min(40, s);
	}

	if (usage === 'city') {
		// Kompakt, elektrisch, einfach parkieren
		let s = 0;
		if (car.drivetrain === 'electric') s += 20;
		else if (car.drivetrain === 'hybrid') s += 10;
		if (car.features.includes('parkAssist') || car.features.includes('surroundCam')) s += 10;
		if (car.type === 'Kleinwagen' || car.type === 'Kompaktwagen') s += 10;
		return Math.min(40, s);
	}

	if (usage === 'commercial') {
		// Anhängerkupplung, Laderaum, Leistung
		let s = 0;
		if (car.features.includes('towHitch')) s += 20;
		if (car.trunkSize >= 550) s += 12;
		else if (car.trunkSize >= 400) s += 6;
		if (car.power >= 150) s += 8;
		return Math.min(40, s);
	}

	if (usage === 'sport') {
		// Leistung, Sportsitze, Marke
		let s = 0;
		if (car.power >= 280) s += 20;
		else if (car.power >= 200) s += 12;
		else if (car.power >= 150) s += 5;
		if (car.features.includes('sportSeats')) s += 10;
		if (car.features.includes('leather')) s += 5;
		if (['BMW', 'Audi', 'Mercedes', 'Cupra', 'Tesla'].includes(car.brand)) s += 5;
		return Math.min(40, s);
	}

	return 20;
}

export function matchScore(car: CarModel, inputs: SearchInputs): number {
	// Harte Filter (100000 = "100'000+" → kein oberes Limit)
	if (inputs.budgetMax < 100000 && car.priceFrom > inputs.budgetMax) return 0;
	if (inputs.drivetrain.length > 0 && !inputs.drivetrain.includes(car.drivetrain)) return 0;
	if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) {
		return 0;
	}
	if (inputs.condition !== 'any' && car.condition !== inputs.condition) return 0;
	if (inputs.bodyTypes.length > 0 && !inputs.bodyTypes.includes(car.bodyType)) return 0;

	let score = 15; // Basis

	// 1) Nutzung — stärkste Gewichtung (bis 40 Punkte)
	if (inputs.usage.length > 0) {
		const total = inputs.usage.reduce((sum, u) => sum + scoreForUsage(car, u), 0);
		score += Math.min(40, Math.round(total / inputs.usage.length));
	} else {
		score += 20; // neutral
	}

	// 2) Ausstattung (bis 25 Punkte)
	if (inputs.features.length > 0) {
		const matches = inputs.features.filter((f) => car.features.includes(f)).length;
		score += Math.round((matches / inputs.features.length) * 25);
	} else {
		score += Math.min(15, Math.round(car.features.length * 1.2));
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
	const withinMax = inputs.budgetMax >= 100000 || car.priceFrom <= inputs.budgetMax;
	if (car.priceFrom >= inputs.budgetMin && withinMax) score += 5;

	// 6) Farbe (bis 5 Punkte)
	if (inputs.colors.length > 0) {
		const colorMatch = inputs.colors.some((c) => car.colors.includes(c));
		if (colorMatch) score += 5;
	}

	return Math.min(100, score);
}
