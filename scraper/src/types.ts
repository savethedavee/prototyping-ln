// Mirror of autofinder/src/lib/types/index.ts (CarOffer + CarModel only).
// This package is intentionally standalone (no workspace), so the shape is
// copied here. Keep in sync with the app if the data model changes.

export type BodyType =
	| 'suv'
	| 'kombi'
	| 'limousine'
	| 'kompakt'
	| 'kleinwagen'
	| 'van'
	| 'coupe'
	| 'cabrio';

export interface CarOffer {
	condition: 'new' | 'used';
	price: number;
	mileage?: number; // km, nur bei used
	color?: string;
	bodyType?: BodyType;
	trunkSize?: number; // Liter
	drivetrain?: 'hybrid' | 'electric' | 'combustion';
	transmission?: 'manual' | 'automatic' | 'dct';
	power?: number; // PS
	consumption?: number; // L/100km or kWh/100km
	co2?: number; // g/km
	seats?: number;
	features?: string[];
	year?: number; // Erstzulassung
	url?: string; // Link zum Inserat
	images?: string[];
	platform?: string; // autoscout24 | mobile.de | ...
	listingId?: string; // Plattform-ID für Deduplizierung
	dealer?: string;
	location?: string; // Stadt / Kanton
}

export interface CarModel {
	_id?: string;
	slug: string;
	name: string;
	brand: string;
	type: string;
	offers: CarOffer[];
	region: 'europe' | 'asia' | 'america';
	warranty: number; // Jahre — Herstellergarantie
	imageUrl?: string;
	description: string;
	detailText: string;
}
