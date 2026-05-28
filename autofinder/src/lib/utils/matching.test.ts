import { describe, it, expect } from 'vitest';
import { getRelevantOffers, getMinPrice, matchScore } from './matching';
import { mockCars } from '../data/mockCars';
import type { CarModel, CarOffer, SearchInputs } from '$lib/types';

type CarOverrides = Partial<CarModel> & {
	drivetrain?: 'hybrid' | 'electric' | 'combustion';
	power?: number;
	consumption?: number;
	co2?: number;
	seats?: number;
	features?: string[];
	color?: string;
	bodyType?: CarOffer['bodyType'];
	trunkSize?: number;
};

function makeCar({
	drivetrain = 'combustion',
	power = 150,
	consumption = 6.0,
	co2 = 140,
	seats = 5,
	features = ['climate', 'carplay'],
	color = 'schwarz',
	bodyType = 'kompakt',
	trunkSize = 400,
	offers: offersOverride,
	...modelOverrides
}: CarOverrides = {}): CarModel {
	return {
		slug: 'test-car',
		name: 'Test Car',
		brand: 'VW',
		type: 'Kompaktwagen',
		region: 'europe',
		warranty: 2,
		description: '',
		detailText: '',
		offers: offersOverride ?? [{ condition: 'new', price: 30000, drivetrain, power, consumption, co2, seats, features, color, bodyType, trunkSize }],
		...modelOverrides
	};
}

function makeInputs(overrides: Partial<SearchInputs> = {}): SearchInputs {
	return {
		budgetMin: 0,
		budgetMax: 100000,
		condition: 'any',
		usage: [],
		drivetrain: [],
		brandRegion: undefined,
		brands: [],
		features: [],
		bodyTypes: [],
		colors: [],
		priorities: { consumption: 3, power: 3, comfort: 3, safety: 3, design: 3 },
		...overrides
	};
}

function car(slug: string): CarModel {
	const found = mockCars.find((c) => c.slug === slug);
	if (!found) throw new Error(`mockCar nicht gefunden: ${slug}`);
	return found;
}

describe('getRelevantOffers', () => {
	it('gibt alle Angebote zurück wenn condition=any und Budget passt', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 30000 },
				{ condition: 'used', price: 22000, mileage: 40000 }
			]
		});
		expect(getRelevantOffers(c, makeInputs())).toHaveLength(2);
	});

	it('filtert nach condition=new', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 30000 },
				{ condition: 'used', price: 22000, mileage: 40000 }
			]
		});
		const result = getRelevantOffers(c, makeInputs({ condition: 'new' }));
		expect(result).toHaveLength(1);
		expect(result[0].condition).toBe('new');
	});

	it('filtert nach condition=used', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 30000 },
				{ condition: 'used', price: 22000, mileage: 40000 }
			]
		});
		const result = getRelevantOffers(c, makeInputs({ condition: 'used' }));
		expect(result).toHaveLength(1);
		expect(result[0].condition).toBe('used');
	});

	it('filtert Angebote über budgetMax heraus', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 50000 },
				{ condition: 'used', price: 22000, mileage: 40000 }
			]
		});
		const result = getRelevantOffers(c, makeInputs({ budgetMax: 30000 }));
		expect(result).toHaveLength(1);
		expect(result[0].price).toBe(22000);
	});

	it('ignoriert budgetMax bei 100000 (open-end)', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 150000 }] });
		expect(getRelevantOffers(c, makeInputs({ budgetMax: 100000 }))).toHaveLength(1);
	});

	it('filtert Angebote unter budgetMin heraus', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 40000 },
				{ condition: 'used', price: 12000, mileage: 80000 }
			]
		});
		const result = getRelevantOffers(c, makeInputs({ budgetMin: 20000 }));
		expect(result).toHaveLength(1);
		expect(result[0].price).toBe(40000);
	});

	it('gibt leeres Array zurück wenn kein Angebot passt', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 60000 }] });
		expect(getRelevantOffers(c, makeInputs({ budgetMax: 40000 }))).toHaveLength(0);
	});

	it('filtert nach Antrieb', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 30000, drivetrain: 'combustion' },
				{ condition: 'new', price: 35000, drivetrain: 'electric' }
			]
		});
		const result = getRelevantOffers(c, makeInputs({ drivetrain: ['electric'] }));
		expect(result).toHaveLength(1);
		expect(result[0].drivetrain).toBe('electric');
	});
});

describe('getMinPrice', () => {
	it('gibt den günstigsten Preis über alle Angebote zurück', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 40000 },
				{ condition: 'used', price: 28000, mileage: 30000 }
			]
		});
		expect(getMinPrice(c)).toBe(28000);
	});

	it('gibt den günstigsten Neupreis zurück bei condition=new', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new', price: 40000 },
				{ condition: 'used', price: 28000, mileage: 30000 }
			]
		});
		expect(getMinPrice(c, 'new')).toBe(40000);
	});

	it('gibt undefined zurück wenn condition nicht verfügbar', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 40000 }] });
		expect(getMinPrice(c, 'used')).toBeUndefined();
	});

	it('gibt undefined zurück bei leerem offers-Array', () => {
		const c = makeCar({ offers: [] });
		expect(getMinPrice(c)).toBeUndefined();
	});
});

describe('matchScore — harte Filter', () => {
	it('gibt 0 zurück wenn kein Angebot im Budget', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 60000 }] });
		expect(matchScore(c, makeInputs({ budgetMax: 40000 }))).toBe(0);
	});

	it('gibt 0 zurück wenn Angebot unter budgetMin', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 10000 }] });
		expect(matchScore(c, makeInputs({ budgetMin: 20000 }))).toBe(0);
	});

	it('gibt 0 zurück wenn condition nicht passt', () => {
		const c = makeCar({ offers: [{ condition: 'new', price: 30000 }] });
		expect(matchScore(c, makeInputs({ condition: 'used' }))).toBe(0);
	});

	it('gibt 0 zurück bei falschem Antrieb', () => {
		const c = makeCar({ drivetrain: 'combustion' });
		expect(matchScore(c, makeInputs({ drivetrain: ['electric'] }))).toBe(0);
	});

	it('gibt 0 zurück bei falscher Region', () => {
		const c = makeCar({ region: 'europe' });
		expect(matchScore(c, makeInputs({ brandRegion: 'asia' }))).toBe(0);
	});

	it('filtert Region nicht wenn brandRegion=any', () => {
		const c = makeCar({ region: 'europe' });
		expect(matchScore(c, makeInputs({ brandRegion: 'any' }))).toBeGreaterThan(0);
	});

	it('gibt 0 zurück bei falscher Karosserieform', () => {
		const c = makeCar({ bodyType: 'suv' });
		expect(matchScore(c, makeInputs({ bodyTypes: ['kombi'] }))).toBe(0);
	});

	it('akzeptiert mehrere Antriebsarten', () => {
		const c = makeCar({ drivetrain: 'hybrid' });
		expect(matchScore(c, makeInputs({ drivetrain: ['electric', 'hybrid'] }))).toBeGreaterThan(0);
	});
});

describe('matchScore — soft scoring', () => {
	it('Basisscore ohne Eingaben ist > 0', () => {
		expect(matchScore(makeCar(), makeInputs())).toBeGreaterThan(0);
	});

	it('Score ist immer ≤ 100', () => {
		const c = makeCar({
			drivetrain: 'electric',
			power: 400,
			features: ['climate', 'carplay', 'navigation', 'rearCam', 'adaptiveCruise',
				'laneAssist', 'seatHeating', 'leather', 'sportSeats', 'wirelessCharging'],
			brand: 'BMW'
		});
		const inputs = makeInputs({
			usage: ['commute', 'sport'],
			features: ['climate', 'carplay'],
			brands: ['BMW'],
			colors: ['schwarz'],
			priorities: { consumption: 5, power: 5, comfort: 5, safety: 5, design: 5 }
		});
		expect(matchScore(c, inputs)).toBeLessThanOrEqual(100);
	});

	it('Marken-Treffer erhöht Score um 10', () => {
		const base = makeCar();
		const withBrand    = matchScore(base, makeInputs({ brands: ['VW'] }));
		const withoutBrand = matchScore(base, makeInputs({ brands: [] }));
		expect(withBrand - withoutBrand).toBe(10);
	});

	it('Farb-Treffer gibt +5 Punkte', () => {
		const c = makeCar({ color: 'schwarz' });
		const withColor    = matchScore(c, makeInputs({ colors: ['schwarz'] }));
		const withoutColor = matchScore(c, makeInputs({ colors: [] }));
		expect(withColor - withoutColor).toBe(5);
	});

	it('keine Farb-Bonus wenn Farbe nicht vorhanden', () => {
		const c = makeCar({ color: 'schwarz' });
		const withColor    = matchScore(c, makeInputs({ colors: ['rot'] }));
		const withoutColor = matchScore(c, makeInputs({ colors: [] }));
		expect(withColor).toBe(withoutColor);
	});

	it('100% Feature-Match gibt mehr Punkte als 0% Match', () => {
		const c = makeCar({ features: ['climate', 'carplay', 'navigation'] });
		const full = matchScore(c, makeInputs({ features: ['climate', 'carplay', 'navigation'] }));
		const none = matchScore(c, makeInputs({ features: ['leather', 'awd', 'hud'] }));
		expect(full).toBeGreaterThan(none);
	});

	it('Priorität Verbrauch ≥4 + Elektro gibt Bonus', () => {
		const electric   = makeCar({ drivetrain: 'electric' });
		const combustion = makeCar({ drivetrain: 'combustion' });
		const inputs = makeInputs({ priorities: { consumption: 5, power: 3, comfort: 3, safety: 3, design: 3 } });
		expect(matchScore(electric, inputs)).toBeGreaterThan(matchScore(combustion, inputs));
	});

	it('Budget-Passgenauigkeit gibt +5 wenn relevanter Mindestpreis im Zielbereich', () => {
		const c = makeCar({
			offers: [
				{ condition: 'new',  price: 35000 },
				{ condition: 'used', price: 15000, mileage: 50000 }
			]
		});
		const withBonus    = matchScore(c, makeInputs({ condition: 'new',  budgetMin: 25000, budgetMax: 40000 }));
		const withoutBonus = matchScore(c, makeInputs({ condition: 'any',  budgetMin: 25000, budgetMax: 40000 }));
		expect(withBonus - withoutBonus).toBe(5);
	});

	it('Elektro-SUV passt besser zu city als Verbrenner-Kombi', () => {
		const electricCity = makeCar({
			drivetrain: 'electric',
			type: 'Kleinwagen',
			features: ['climate', 'parkAssist']
		});
		const combustionKombi = makeCar({
			drivetrain: 'combustion',
			type: 'Kombi',
			features: ['climate', 'towHitch', 'roofRails']
		});
		const inputs = makeInputs({ usage: ['city'] });
		expect(matchScore(electricCity, inputs)).toBeGreaterThan(matchScore(combustionKombi, inputs));
	});

	it('Kombi mit AHK passt besser zu leisure als Kleinwagen', () => {
		const kombi = makeCar({
			trunkSize: 600,
			features: ['climate', 'towHitch', 'roofRails', 'awd']
		});
		const kleinwagen = makeCar({
			trunkSize: 200,
			features: ['climate', 'carplay']
		});
		const inputs = makeInputs({ usage: ['leisure'] });
		expect(matchScore(kombi, inputs)).toBeGreaterThan(matchScore(kleinwagen, inputs));
	});
});

describe('mockCars Integrationstests', () => {
	it('Renault Zoe hat kein Neuwagen-Angebot → matchScore 0 bei condition=new', () => {
		expect(matchScore(car('renault-zoe'), makeInputs({ condition: 'new' }))).toBe(0);
	});

	it('Budget unter 22k filtert teure Neuwagen heraus (z.B. BMW 3er)', () => {
		expect(getRelevantOffers(car('bmw-320d'), makeInputs({ budgetMax: 22000 }))).toHaveLength(0);
	});

	it('Dacia Duster passt ins Budget unter 22k (Gebraucht 19.9k)', () => {
		const offers = getRelevantOffers(car('dacia-duster'), makeInputs({ budgetMax: 22000 }));
		expect(offers).toHaveLength(1);
		expect(offers[0].price).toBe(19900);
	});

	it('Toyota RAV4 Hybrid scort höher als VW Golf für usage=family', () => {
		const inputs = makeInputs({ usage: ['family'] });
		expect(matchScore(car('toyota-rav4-hybrid'), inputs)).toBeGreaterThan(matchScore(car('vw-golf-tdi'), inputs));
	});

	it('BMW M3 scort höher als Renault Zoe für usage=sport', () => {
		const inputs = makeInputs({ usage: ['sport'] });
		expect(matchScore(car('bmw-m3'), inputs)).toBeGreaterThan(matchScore(car('renault-zoe'), inputs));
	});

	it('Tesla Model 3 scort höher als VW Passat für usage=commute + drivetrain=electric', () => {
		const inputs = makeInputs({ usage: ['commute'], drivetrain: ['electric'] });
		expect(matchScore(car('tesla-model-3'), inputs)).toBeGreaterThan(0);
		expect(matchScore(car('vw-passat-variant-tdi'), inputs)).toBe(0);
	});

	it('VW Passat Variant scort höher als Fiat 500e für usage=leisure', () => {
		const inputs = makeInputs({ usage: ['leisure'] });
		expect(matchScore(car('vw-passat-variant-tdi'), inputs)).toBeGreaterThan(matchScore(car('fiat-500e'), inputs));
	});

	it('Mitsubishi Outlander PHEV ist einziges Auto mit 7 Sitzen', () => {
		const with7Seats = mockCars.filter((c) => c.offers.some((o) => (o.seats ?? 0) >= 7));
		expect(with7Seats.map((c) => c.slug)).toContain('mitsubishi-outlander-phev');
	});

	it('alle mockCars haben mindestens ein Angebot', () => {
		mockCars.forEach((c) => {
			expect(c.offers.length, `${c.slug} hat keine Angebote`).toBeGreaterThan(0);
		});
	});

	it('Porsche Taycan wird bei brandRegion=asia rausgefiltert (region=europe)', () => {
		expect(matchScore(car('porsche-taycan'), makeInputs({ brandRegion: 'asia' }))).toBe(0);
	});

	it('kein Auto überschreitet Score 100', () => {
		const inputs = makeInputs({
			usage: ['commute', 'city'],
			drivetrain: ['electric'],
			features: ['climate', 'carplay', 'navigation'],
			priorities: { consumption: 5, power: 5, comfort: 5, safety: 5, design: 5 }
		});
		mockCars.forEach((c) => {
			expect(matchScore(c, inputs), `${c.slug} überschreitet 100`).toBeLessThanOrEqual(100);
		});
	});
});
