import type { CarModel } from '$lib/types';
import { getDb } from './db';

const COLLECTION = 'cars';

function stripId<T extends { _id?: unknown }>(doc: T): Omit<T, '_id'> {
	const { _id, ...rest } = doc;
	return rest;
}

export async function getAllCars(): Promise<CarModel[]> {
	const db = await getDb();
	const docs = await db.collection<CarModel>(COLLECTION).find().toArray();
	return docs.map(stripId);
}

export async function getCarBySlug(slug: string): Promise<CarModel | undefined> {
	const db = await getDb();
	const doc = await db.collection<CarModel>(COLLECTION).findOne({ slug });
	return doc ? stripId(doc) : undefined;
}
