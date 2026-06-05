import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from './auth';

/** Pages reachable without being logged in. Everything else requires auth. */
function isPublic(pathname: string): boolean {
	if (pathname === '/') return true; // Startseite
	if (pathname === '/login') return true; // eigene Login-Seite
	if (pathname.startsWith('/auth')) return true; // Login-Flow (Auth.js)
	return false;
}

/** Redirect unauthenticated users to the login, except on public pages. */
const guard: Handle = async ({ event, resolve }) => {
	// event.route.id is only set for real app routes (not static assets).
	if (event.route.id && !isPublic(event.url.pathname)) {
		const session = await event.locals.auth();
		if (!session) {
			const callbackUrl = encodeURIComponent(event.url.pathname + event.url.search);
			throw redirect(303, `/login?callbackUrl=${callbackUrl}`);
		}
	}
	return resolve(event);
};

export const handle = sequence(authHandle, guard);
