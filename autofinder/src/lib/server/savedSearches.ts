import { ObjectId } from 'mongodb';
import type { SavedSearch, SearchInputs } from '$lib/types';
import { getDb } from './db';

const COLLECTION = 'savedSearches';

type SavedSearchDoc = Omit<SavedSearch, '_id'> & { _id: ObjectId };

/** Serialize a Mongo doc for the client (ObjectId/Date → string). */
function toClient(doc: SavedSearchDoc): SavedSearch {
	const { _id, createdAt, updatedAt, ...rest } = doc;
	return {
		_id: _id.toString(),
		createdAt: new Date(createdAt).toISOString(),
		updatedAt: new Date(updatedAt).toISOString(),
		...rest
	};
}

export async function getSavedSearches(userId: string): Promise<SavedSearch[]> {
	const db = await getDb();
	const docs = await db
		.collection<SavedSearchDoc>(COLLECTION)
		.find({ userId })
		.sort({ createdAt: -1 })
		.toArray();
	return docs.map(toClient);
}

export async function createSavedSearch(
	userId: string,
	name: string,
	inputs: SearchInputs
): Promise<void> {
	const db = await getDb();
	const now = new Date();
	await db.collection<Omit<SavedSearchDoc, '_id'>>(COLLECTION).insertOne({
		userId,
		name,
		inputs,
		isDraft: false,
		currentStep: 6,
		createdAt: now,
		updatedAt: now
	});
}

/** Deletes a saved search — only if it belongs to the given user. */
export async function deleteSavedSearch(userId: string, id: string): Promise<boolean> {
	if (!ObjectId.isValid(id)) return false;
	const db = await getDb();
	const res = await db
		.collection<SavedSearchDoc>(COLLECTION)
		.deleteOne({ _id: new ObjectId(id), userId });
	return res.deletedCount === 1;
}

/** Renames a saved search — only if it belongs to the given user. */
export async function renameSavedSearch(
	userId: string,
	id: string,
	name: string
): Promise<boolean> {
	if (!ObjectId.isValid(id)) return false;
	const db = await getDb();
	const res = await db
		.collection<SavedSearchDoc>(COLLECTION)
		.updateOne({ _id: new ObjectId(id), userId }, { $set: { name, updatedAt: new Date() } });
	return res.matchedCount === 1;
}

/** Updates the criteria of a saved search — only if it belongs to the given user. */
export async function updateSavedSearchInputs(
	userId: string,
	id: string,
	inputs: SearchInputs
): Promise<boolean> {
	if (!ObjectId.isValid(id)) return false;
	const db = await getDb();
	const res = await db
		.collection<SavedSearchDoc>(COLLECTION)
		.updateOne({ _id: new ObjectId(id), userId }, { $set: { inputs, updatedAt: new Date() } });
	return res.matchedCount === 1;
}
