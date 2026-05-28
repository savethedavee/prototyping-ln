import 'dotenv/config';
import { MongoClient } from 'mongodb';
import { mockCars } from '../src/lib/data/mockCars';
import type { CarModel } from '../src/lib/types';

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'autofinder';
const COLLECTION = 'cars';

if (!URI) {
	console.error('MONGODB_URI not set — copy .env.example to .env and fill it in');
	process.exit(1);
}

async function seed() {
	const client = new MongoClient(URI!);
	await client.connect();
	const db = client.db(DB_NAME);
	const col = db.collection<CarModel>(COLLECTION);

	await col.createIndex({ slug: 1 }, { unique: true });

	let upserted = 0;
	for (const car of mockCars) {
		const result = await col.updateOne(
			{ slug: car.slug },
			{ $set: car },
			{ upsert: true }
		);
		if (result.upsertedCount > 0 || result.modifiedCount > 0) upserted++;
	}

	console.log(`Seeded ${upserted} / ${mockCars.length} cars into "${DB_NAME}.${COLLECTION}"`);
	await client.close();
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
