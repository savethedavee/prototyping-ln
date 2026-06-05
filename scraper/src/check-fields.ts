/**
 * Prüft, wie vollständig die Offers in der DB befüllt sind (inkl. features).
 *   npx tsx src/check-fields.ts
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import type { CarModel } from './types.js';

// Felder, die wir pro Offer prüfen.
const OFFER_FIELDS = [
    'condition', 'price', 'mileage', 'color', 'bodyType', 'trunkSize',
    'drivetrain', 'transmission', 'power', 'consumption', 'co2', 'seats',
    'features', 'year', 'url', 'images', 'platform', 'listingId', 'dealer', 'location'
] as const;

function isFilled(v: unknown): boolean {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;     // features/images: leer = nicht befülltoa
    if (typeof v === 'string') return v.trim() !== '';
    return true;                                    // Zahlen (auch 0) gelten als befüllt
}

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not set — copy .env.example to .env');

    const client = new MongoClient(uri);
    await client.connect();
    const col = client.db(process.env.MONGODB_DB || 'autofinder').collection<CarModel>('cars');
    const models = await col.find({}).toArray();

    let offerCount = 0;
    const filled: Record<string, number> = {};
    for (const f of OFFER_FIELDS) filled[f] = 0;

    const offersWithoutFeatures: string[] = [];
    for (const m of models) {
        for (const o of m.offers ?? []) {
            offerCount++;
            const rec = o as unknown as Record<string, unknown>;
            for (const f of OFFER_FIELDS) {
                if (isFilled(rec[f])) filled[f]++;
            }
            if (!isFilled(rec.features)) {
                offersWithoutFeatures.push(`${m.slug} (${o.listingId ?? '?'})`);
            }
        }
    }

    console.log(`\n  ${models.length} models · ${offerCount} offers\n`);
    console.log('  Befüllungsgrad pro Feld:');
    for (const f of OFFER_FIELDS) {
        const n = filled[f];
        const pct = offerCount ? Math.round((n / offerCount) * 100) : 0;
        const flag = pct === 100 ? '✓' : pct === 0 ? '✗' : '·';
        console.log(`   ${flag} ${f.padEnd(13)} ${String(n).padStart(4)}/${offerCount}  (${pct}%)`);
    }

    console.log(`\n  Offers ohne features: ${offersWithoutFeatures.length}`);
    if (offersWithoutFeatures.length) {
        console.log('   z.B. ' + offersWithoutFeatures.slice(0, 15).join(', '));
    }

    await client.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});