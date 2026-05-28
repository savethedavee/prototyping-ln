import { MongoClient, type Db } from 'mongodb';
import { env } from '$env/dynamic/private';

let dbPromise: Promise<Db> | undefined;

export function getDb(): Promise<Db> {
	if (!dbPromise) {
		if (!env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
		const client = new MongoClient(env.MONGODB_URI);
		dbPromise = client.connect().then((c) => c.db(env.MONGODB_DB || 'autofinder'));
	}
	return dbPromise;
}
