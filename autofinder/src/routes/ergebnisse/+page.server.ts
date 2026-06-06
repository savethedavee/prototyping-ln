import { fail } from '@sveltejs/kit';
import { getAllCars } from '$lib/server/cars';
import { createSavedSearch, updateSavedSearchInputs } from '$lib/server/savedSearches';
import type { SearchInputs } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

// The result list is scored/sorted from client-only sessionStorage inputs, so a
// server render would differ from the client and cause hydration mismatches.
// Render this route on the client only. (The DB load still runs on the server.)
export const ssr = false;

export const load: PageServerLoad = async () => {
	const cars = await getAllCars();
	return { cars };
};

export const actions: Actions = {
	saveSearch: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session?.user?.id) return fail(401, { saved: false, error: 'Nicht angemeldet.' });

		const form = await request.formData();
		const editingId = String(form.get('editingId') ?? '').trim();
		const name = String(form.get('name') ?? '').trim();
		const rawInputs = String(form.get('inputs') ?? '');

		let inputs: SearchInputs;
		try {
			inputs = JSON.parse(rawInputs);
		} catch {
			return fail(400, { saved: false, error: 'Ungültige Suchdaten.' });
		}

		// Editing an existing search → update its criteria (keep the name).
		if (editingId) {
			const ok = await updateSavedSearchInputs(session.user.id, editingId, inputs);
			if (!ok) return fail(400, { saved: false, error: 'Suche nicht gefunden.' });
			return { saved: true, updated: true };
		}

		if (!name) return fail(400, { saved: false, error: 'Bitte einen Namen eingeben.' });
		await createSavedSearch(session.user.id, name, inputs);
		return { saved: true, updated: false };
	}
};
