import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { isPublicPath } from '$lib/publicRoutes';
import { handle as authHandle } from './auth';

/** Redirect unauthenticated users to the login, except on public pages. */
const guard: Handle = async ({ event, resolve }) => {
	// event.route.id is only set for real app routes (not static assets).
	if (event.route.id && !isPublicPath(event.url.pathname)) {
		const session = await event.locals.auth();
		if (!session) {
			const callbackUrl = encodeURIComponent(event.url.pathname + event.url.search);
			throw redirect(303, `/login?callbackUrl=${callbackUrl}`);
		}
	}
	return resolve(event);
};

export const handle = sequence(authHandle, guard);
