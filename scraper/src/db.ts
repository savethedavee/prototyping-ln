import { MongoClient, type Collection } from 'mongodb';
import type { CarModel, CarOffer } from './types.js';

const COLLECTION = 'cars';

let client: MongoClient | undefined;

async function getCollection(): Promise<Collection<CarModel>> {
	const uri = process.env.MONGODB_URI;
	if (!uri) throw new Error('MONGODB_URI not set — copy .env.example to .env and fill it in');
	if (!client) {
		client = new MongoClient(uri);
		await client.connect();
	}
	const db = client.db(process.env.MONGODB_DB || 'autofinder');
	const col = db.collection<CarModel>(COLLECTION);
	await col.createIndex({ slug: 1 }, { unique: true });
	return col;
}

export async function closeDb(): Promise<void> {
	if (client) {
		await client.close();
		client = undefined;
	}
}

export interface UpsertResult {
	slug: string;
	created: boolean;
	addedOffers: number;
	updatedOffers: number;
	totalOffers: number;
}

/**
 * Upserts one scraped model. Model-level fields (description, warranty, …) are
 * only written when the document is first created. Offers are merged by
 * listingId so re-running the scraper refreshes existing listings instead of
 * duplicating them.
 */
export async function upsertModel(model: CarModel): Promise<UpsertResult> {
	const col = await getCollection();
	const existing = await col.findOne({ slug: model.slug });

	if (!existing) {
		await col.insertOne(model);
		return {
			slug: model.slug,
			created: true,
			addedOffers: model.offers.length,
			updatedOffers: 0,
			totalOffers: model.offers.length
		};
	}

	const merged = mergeOffers(existing.offers ?? [], model.offers);
	await col.updateOne({ slug: model.slug }, { $set: { offers: merged.offers } });

	return {
		slug: model.slug,
		created: false,
		addedOffers: merged.added,
		updatedOffers: merged.updated,
		totalOffers: merged.offers.length
	};
}

function mergeOffers(
	existing: CarOffer[],
	incoming: CarOffer[]
): { offers: CarOffer[]; added: number; updated: number } {
	const byId = new Map<string, CarOffer>();
	const noId: CarOffer[] = [];

	for (const offer of existing) {
		if (offer.listingId) byId.set(offer.listingId, offer);
		else noId.push(offer);
	}

	let added = 0;
	let updated = 0;
	for (const offer of incoming) {
		if (!offer.listingId) {
			noId.push(offer);
			added++;
			continue;
		}
		if (byId.has(offer.listingId)) updated++;
		else added++;
		byId.set(offer.listingId, offer);
	}

	return { offers: [...byId.values(), ...noId], added, updated };
}
