import { getCarsBySlugs } from '$lib/server/cars';
import type { CarModel } from '$lib/types';
import type { PageServerLoad } from './$types';

// Scores are computed from client-only sessionStorage inputs (like /ergebnisse),
// so render on the client to avoid hydration mismatches. The DB load still runs
// on the server.
export const ssr = false;

export const load: PageServerLoad = async ({ url }) => {
	const ids = (url.searchParams.get('ids') ?? '')
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);

	const cars = await getCarsBySlugs(ids);
	// Preserve the order the user selected them in.
	const ordered = ids
		.map((slug) => cars.find((c) => c.slug === slug))
		.filter((c): c is CarModel => !!c);

	return { cars: ordered };
};
