import { fail } from '@sveltejs/kit';
import { deleteSavedSearch, getSavedSearches, renameSavedSearch } from '$lib/server/savedSearches';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	const searches = session?.user?.id ? await getSavedSearches(session.user.id) : [];
	return { searches };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) return fail(401);

		const id = String((await request.formData()).get('id') ?? '');
		const ok = await deleteSavedSearch(session.user.id, id);
		if (!ok) return fail(400, { error: 'Konnte nicht gelöscht werden.' });
		return { deleted: true };
	},

	rename: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) return fail(401);

		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const name = String(form.get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'Bitte einen Namen eingeben.' });

		const ok = await renameSavedSearch(session.user.id, id, name);
		if (!ok) return fail(400, { error: 'Konnte nicht umbenannt werden.' });
		return { renamed: true };
	}
};
