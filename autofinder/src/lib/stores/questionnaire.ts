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
const EDIT_KEY = 'autofinder:editingSearchId';

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

// Id of the saved search currently being edited (null = creating a new search).
export const editingSearchId = writable<string | null>(
	browser ? sessionStorage.getItem(EDIT_KEY) : null
);

export function setEditingSearchId(id: string | null) {
	editingSearchId.set(id);
	if (!browser) return;
	if (id) sessionStorage.setItem(EDIT_KEY, id);
	else sessionStorage.removeItem(EDIT_KEY);
}

export function persistSearchInputs() {
	if (!browser) return;
	sessionStorage.setItem(SESSION_KEY, JSON.stringify(get(searchInputs)));
}

export function clearSearchInputs() {
	if (browser) {
		sessionStorage.removeItem(SESSION_KEY);
		sessionStorage.removeItem(EDIT_KEY);
	}
	currentStep.set(1);
	searchInputs.set(structuredClone(defaultInputs));
	editingSearchId.set(null);
}

export function resetQuestionnaire() {
	clearSearchInputs();
}
