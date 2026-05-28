import 'dotenv/config';
import { MongoClient } from 'mongodb';

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'autofinder';

if (!URI) {
	console.error('MONGODB_URI not set');
	process.exit(1);
}

async function check() {
	const client = new MongoClient(URI!);
	await client.connect();

	console.log('Connected to cluster');
	console.log('Using database:', DB_NAME);

	const dbs = await client.db().admin().listDatabases();
	console.log('\nAvailable databases:');
	dbs.databases.forEach((d) => console.log(`  - ${d.name} (${d.sizeOnDisk} bytes)`));

	const db = client.db(DB_NAME);
	const collections = await db.listCollections().toArray();
	console.log(`\nCollections in "${DB_NAME}":`);
	collections.forEach((c) => console.log(`  - ${c.name}`));

	const count = await db.collection('cars').countDocuments();
	console.log(`\nDocuments in "${DB_NAME}.cars": ${count}`);

	if (count > 0) {
		const sample = await db.collection('cars').findOne();
		console.log('\nFirst document slug:', sample?.slug, '| name:', sample?.name);
	}

	await client.close();
}

check().catch((err) => {
	console.error(err);
	process.exit(1);
});
