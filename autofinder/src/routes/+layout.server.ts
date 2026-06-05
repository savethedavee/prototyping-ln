import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

/** Pages reachable without being logged in. Everything else requires auth. */
function isPublic(pathname: string): boolean {
	if (pathname === '/') return true; // Startseite
	if (pathname === '/login') return true; // eigene Login-Seite
	if (pathname.startsWith('/auth')) return true; // Login-Flow (Auth.js)
	return false;
}

// Reading `url` makes this layout load re-run on every client-side navigation,
// so the auth guard also catches link clicks (not just full reloads).
export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session && !isPublic(url.pathname)) {
		const callbackUrl = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?callbackUrl=${callbackUrl}`);
	}
	return { user: session?.user ?? null };
};
