import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export type Theme = 'light' | 'dark';
const KEY = 'theme';

function initial(): Theme {
	if (!browser) return 'light';
	return sessionStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
}

export const theme = writable<Theme>(initial());

if (browser) {
	// Persist in sessionStorage and reflect the choice on <html> so the global
	// `.dark` CSS overrides take effect across the whole site.
	theme.subscribe((t) => {
		sessionStorage.setItem(KEY, t);
		document.documentElement.classList.toggle('dark', t === 'dark');
	});
}

export function toggleTheme() {
	theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}
