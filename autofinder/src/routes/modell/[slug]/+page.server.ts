import { error } from '@sveltejs/kit';
import { getCarBySlug } from '$lib/server/cars';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const car = await getCarBySlug(params.slug);
	if (!car) throw error(404, 'Modell nicht gefunden');
	return { car };
};
