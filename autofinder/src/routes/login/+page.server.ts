import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/** Only allow internal redirect targets (no open redirects). */
function safePath(cb: string | null): string {
	return cb && cb.startsWith('/') && !cb.startsWith('//') ? cb : '/';
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const callbackUrl = safePath(url.searchParams.get('callbackUrl'));
	const session = await locals.auth();
	// Already logged in → straight to where they were headed.
	if (session) throw redirect(303, callbackUrl);
	return { callbackUrl };
};
