import { getAllCars } from '$lib/server/cars';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const cars = await getAllCars();
	return { cars };
};
