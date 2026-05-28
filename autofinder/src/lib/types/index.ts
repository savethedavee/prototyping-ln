export interface CarOffer {
	condition: 'new' | 'used';
	price: number;
	mileage?: number; // km, nur bei used
}

export interface CarModel {
	_id?: string;
	slug: string;
	name: string;
	brand: string;
	type: string;
	bodyType: 'suv' | 'kombi' | 'limousine' | 'kompakt' | 'kleinwagen' | 'van';
	offers: CarOffer[];
	colors: string[];
	drivetrain: 'hybrid' | 'electric' | 'combustion';
	region: 'europe' | 'asia' | 'america';
	consumption: number; // L/100km or kWh/100km for electric
	power: number; // PS
	trunkSize: number; // Liter
	co2: number; // g/km
	warranty: number; // Jahre
	seats: number;
	features: string[];
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
