import { getAllCars } from '$lib/server/cars';
import type { PageServerLoad } from './$types';

// The result list is scored/sorted from client-only sessionStorage inputs, so a
// server render would differ from the client and cause hydration mismatches.
// Render this route on the client only. (The DB load still runs on the server.)
export const ssr = false;

export const load: PageServerLoad = async () => {
	const cars = await getAllCars();
	return { cars };
};
