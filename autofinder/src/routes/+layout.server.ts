import { redirect } from '@sveltejs/kit';
import { isPublicPath } from '$lib/publicRoutes';
import type { LayoutServerLoad } from './$types';

// Reading `url` makes this layout load re-run on every client-side navigation,
// so the auth guard also catches link clicks (not just full reloads).
export const load: LayoutServerLoad = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session && !isPublicPath(url.pathname)) {
		const callbackUrl = encodeURIComponent(url.pathname + url.search);
		throw redirect(303, `/login?callbackUrl=${callbackUrl}`);
	}
	return { user: session?.user ?? null };
};
