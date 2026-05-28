export type BodyType = 'suv' | 'kombi' | 'limousine' | 'kompakt' | 'kleinwagen' | 'van';

export interface CarOffer {
	condition: 'new' | 'used';
	price: number;
	mileage?: number;       // km, nur bei used
	color?: string;
	bodyType?: BodyType;
	trunkSize?: number;     // Liter
	drivetrain?: 'hybrid' | 'electric' | 'combustion';
	transmission?: 'manual' | 'automatic' | 'dct';
	power?: number;         // PS
	consumption?: number;   // L/100km or kWh/100km
	co2?: number;           // g/km
	seats?: number;
	features?: string[];
	year?: number;          // Erstzulassung
	url?: string;           // Link zum Inserat
	images?: string[];
	platform?: string;      // autoscout24 | mobile.de | ...
	listingId?: string;     // Plattform-ID für Deduplizierung
	dealer?: string;
	location?: string;      // Stadt / Kanton
}

export interface CarModel {
	_id?: string;
	slug: string;
	name: string;
	brand: string;
	type: string;
	offers: CarOffer[];
	region: 'europe' | 'asia' | 'america';
	warranty: number;   // Jahre — Herstellergarantie
	imageUrl?: string;
	description: string;
	detailText: string;
}

export interface SearchPriorities {
	consumption: number; // 1–5
	power: number;
	comfort: number;
	safety: number;
	design: number;
}

export interface SearchInputs {
	budgetMin: number;
	budgetMax: number;
	condition: 'new' | 'used' | 'any';
	usage: string[];
	drivetrain: string[];
	brandRegion?: string;
	brands?: string[];
	features: string[];
	bodyTypes: string[];
	colors: string[];
	priorities: SearchPriorities;
}

export interface SavedSearch {
	_id?: string;
	name: string;
	createdAt: Date | string;
	updatedAt: Date | string;
	inputs: SearchInputs;
	isDraft: boolean;
	currentStep: number;
}

export interface CarModelWithScore extends CarModel {
	matchScore: number;
}
