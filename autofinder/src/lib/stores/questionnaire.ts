import { writable } from 'svelte/store';
import type { SearchInputs } from '$lib/types';

export const TOTAL_STEPS = 6;

export const defaultInputs: SearchInputs = {
	budgetMin: 25000,
	budgetMax: 45000,
	usage: [],
	drivetrain: [],
	brandRegion: undefined,
	brands: [],
	features: [],
	priorities: {
		consumption: 3,
		power: 3,
		comfort: 3,
		safety: 3,
		design: 3
	}
};

export const currentStep = writable(1);
export const searchInputs = writable<SearchInputs>(structuredClone(defaultInputs));

export function resetQuestionnaire() {
	currentStep.set(1);
	searchInputs.set(structuredClone(defaultInputs));
}
