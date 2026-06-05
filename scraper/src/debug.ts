import 'dotenv/config';
import { launch, newPage, scrapeListing } from './scrape.js';

const url = process.argv[2];

const context = await launch();
const page = await newPage(context);
const raw = await scrapeListing(page, url);
console.log('title:', raw.title);
console.log('priceText:', raw.priceText);
console.log('breadcrumbs:', raw.breadcrumbs);
console.log('jsonLd count:', raw.jsonLd.length);
console.log('jsonLd:', JSON.stringify(raw.jsonLd, null, 2).slice(0, 2000));
console.log('spec keys:', Object.keys(raw.specs));
console.log('specs:', JSON.stringify(raw.specs, null, 2).slice(0, 1500));
console.log('images:', raw.images.slice(0, 3));
console.log('equipment (' + raw.equipment.length + '):', raw.equipment.slice(0, 30));
await context.close();
