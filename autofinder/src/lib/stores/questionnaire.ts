import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { SearchInputs } from '$lib/types';

export const TOTAL_STEPS = 6;

export const defaultInputs: SearchInputs = {
	budgetMin: 25000,
	budgetMax: 45000,
	condition: 'any',
	usage: [],
	drivetrain: [],
	brandRegion: undefined,
	brands: [],
	features: [],
	bodyTypes: [],
	colors: [],
	priorities: {
		consumption: 3,
		power: 3,
		comfort: 3,
		safety: 3,
		design: 3
	}
};

const SESSION_KEY = 'autofinder:searchInputs';

function loadFromSession(): SearchInputs {
	if (!browser) return structuredClone(defaultInputs);
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		if (!raw) return structuredClone(defaultInputs);
		return { ...structuredClone(defaultInputs), ...JSON.parse(raw) };
	} catch {
		return structuredClone(defaultInputs);
	}
}

export const currentStep = writable(1);
export const searchInputs = writable<SearchInputs>(loadFromSession());

export function persistSearchInputs() {
	if (!browser) return;
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(get(searchInputs)));
}

export function clearSearchInputs() {
	if (browser) sessionStorage.removeItem(SESSION_KEY);
	currentStep.set(1);
	searchInputs.set(structuredClone(defaultInputs));
}

export function resetQuestionnaire() {
	clearSearchInputs();
}
