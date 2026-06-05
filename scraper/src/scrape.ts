import { resolve } from 'node:path';
import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { BrowserContext, Page } from 'playwright';

chromium.use(StealthPlugin());

export interface RawScrape {
	url: string;
	title?: string;
	priceText?: string;
	/** Normalised (lowercased, trimmed) spec label → value, from the key-data section. */
	specs: Record<string, string>;
	images: string[];
	dealer?: string;
	location?: string;
	breadcrumbs: string[];
	jsonLd: unknown[];
}

const UA =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/**
 * Launch a *persistent* browser context. A real user-data dir keeps cookies —
 * crucially Cloudflare's `cf_clearance` — across runs, so once the challenge is
 * solved by hand the bot-check stays cleared on later runs. Profile path via
 * CHROME_PROFILE (default ./.chrome-profile).
 */
export async function launch(): Promise<BrowserContext> {
	const headless = (process.env.HEADLESS ?? 'true') !== 'false';
	const userDataDir = process.env.CHROME_PROFILE || resolve('.chrome-profile');
	const ctx = await chromium.launchPersistentContext(userDataDir, {
		headless,
		// On a headful local run, drive the real installed Chrome instead of the
		// bundled Chromium — it clears Cloudflare far more reliably. Falls back to
		// bundled Chromium automatically if Chrome isn't installed.
		...(headless ? {} : { channel: 'chrome' }),
		userAgent: UA,
		viewport: { width: 1366, height: 900 },
		locale: 'de-CH',
		timezoneId: 'Europe/Zurich',
		extraHTTPHeaders: { 'Accept-Language': 'de-CH,de;q=0.9,en;q=0.8' },
		args: ['--disable-blink-features=AutomationControlled']
	});
	// Minimal stealth: hide the automation flag Cloudflare looks for.
	await ctx.addInitScript(() => {
		Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
	});
	return ctx;
}

export async function newPage(ctx: BrowserContext): Promise<Page> {
	// A persistent context starts with one blank page — reuse it.
	const page = ctx.pages()[0] ?? (await ctx.newPage());
	page.setDefaultTimeout(30_000);
	return page;
}

/** Random integer in [min, max]. */
function rand(min: number, max: number): number {
	return Math.floor(min + Math.random() * (max - min + 1));
}

/** Wait a randomised, human-ish amount of time. */
export async function humanDelay(page: Page, min = 1800, max = 4500): Promise<void> {
	await page.waitForTimeout(rand(min, max));
}

/** Scroll the page in a few small steps, as a reader would. */
export async function humanScroll(page: Page): Promise<void> {
	const steps = rand(2, 5);
	for (let i = 0; i < steps; i++) {
		await page.mouse.wheel(0, rand(300, 800));
		await page.waitForTimeout(rand(250, 700));
	}
}

/** True while the page is showing a Cloudflare / bot-check interstitial. */
async function isChallenge(page: Page): Promise<boolean> {
	const t = (await page.title()).toLowerCase();
	return /verbindung|moment|just a|attention required|checking|sicherstellung|ensuring|connection is secure/.test(
		t
	);
}

/**
 * Navigate and wait for any Cloudflare challenge to clear. In headful mode this
 * waits up to 3 minutes so you can solve the challenge by hand in the window;
 * in headless mode it only briefly waits for an auto-clear.
 */
async function gotoAndSettle(page: Page, url: string): Promise<void> {
	await page.goto(url, { waitUntil: 'domcontentloaded' });
	const headful = (process.env.HEADLESS ?? 'true') === 'false';
	const maxWait = headful ? 180 : 30; // seconds
	let warned = false;
	for (let i = 0; i < maxWait && (await isChallenge(page)); i++) {
		if (headful && !warned) {
			console.log('  ⏳ Cloudflare-Challenge erkannt — bitte im Browserfenster lösen…');
			warned = true;
		}
		await page.waitForTimeout(1000);
	}
}

/** Click away the cookie consent banner if present (best effort). */
async function dismissConsent(page: Page): Promise<void> {
	const candidates = [
		'button:has-text("Akzeptieren")',
		'button:has-text("Alle akzeptieren")',
		'button:has-text("Zustimmen")',
		'#onetrust-accept-btn-handler',
		'[data-testid="cookie-accept"]'
	];
	for (const sel of candidates) {
		const btn = page.locator(sel).first();
		try {
			if (await btn.isVisible({ timeout: 1500 })) {
				await btn.click({ timeout: 2000 });
				return;
			}
		} catch {
			// not present — try next
		}
	}
}

/**
 * Collects listing detail URLs from a search-results URL, paginating until
 * `max` links are gathered or pages run out.
 */
export async function collectListingUrls(page: Page, searchUrl: string, max: number): Promise<string[]> {
	const found = new Set<string>();
	let pageNum = 1;

	while (found.size < max) {
		const url = withPageParam(searchUrl, pageNum);
		await gotoAndSettle(page, url);
		if (pageNum === 1) await dismissConsent(page);
		// Scroll the results so lazy-loaded cards appear and it looks human.
		await humanScroll(page);

		// Detail links on AS24.ch look like /de/d/<slug>-<id>
		const hrefs = await page.$$eval('a[href*="/d/"]', (els) =>
			els.map((e) => (e as HTMLAnchorElement).href)
		);

		const before = found.size;
		for (const href of hrefs) {
			if (/\/d\//.test(href)) found.add(href.split('?')[0]);
			if (found.size >= max) break;
		}

		// No new links → assume we hit the last page.
		if (found.size === before) break;
		pageNum++;
		await humanDelay(page); // pause before paging on, like a person reading
	}

	return [...found].slice(0, max);
}

function withPageParam(searchUrl: string, pageNum: number): string {
	const u = new URL(searchUrl);
	if (pageNum > 1) u.searchParams.set('page', String(pageNum));
	return u.toString();
}

/** Loads a listing detail page and pulls out raw, unparsed data. */
export async function scrapeListing(page: Page, url: string): Promise<RawScrape> {
	await gotoAndSettle(page, url);
	// Glance over the page like a human before reading the data off it.
	await humanScroll(page);

	return page.evaluate(() => {
		// tsx/esbuild wraps named functions with a __name() helper that isn't
		// defined in the browser context — provide a no-op so it resolves.
		// Computed-member + `||` operand avoids esbuild re-wrapping this line.
		const g = globalThis as unknown as Record<string, unknown>;
		g['__name'] = g['__name'] || function (f: unknown) { return f; };

		const text = (el: Element | null) => el?.textContent?.trim() || undefined;

		// JSON-LD blocks (schema.org Vehicle/Car/Product).
		const jsonLd: unknown[] = [];
		document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
			try {
				jsonLd.push(JSON.parse(s.textContent || ''));
			} catch {
				/* ignore malformed */
			}
		});

		// Key-data: generic dt/dd pairs + table rows anywhere on the page.
		const specs: Record<string, string> = {};
		document.querySelectorAll('dl').forEach((dl) => {
			const dts = dl.querySelectorAll('dt');
			const dds = dl.querySelectorAll('dd');
			for (let i = 0; i < Math.min(dts.length, dds.length); i++) {
				const k = text(dts[i]);
				const v = text(dds[i]);
				if (k && v) specs[k.toLowerCase()] = v;
			}
		});
		document.querySelectorAll('tr').forEach((tr) => {
			const cells = tr.querySelectorAll('th, td');
			if (cells.length === 2) {
				const k = text(cells[0]);
				const v = text(cells[1]);
				if (k && v) specs[k.toLowerCase()] = v;
			}
		});

		const images = Array.from(document.querySelectorAll('img'))
			.map((img) => (img as HTMLImageElement).src)
			.filter((src) => /^https?:/.test(src) && /listing|vehicle|fp-|images/i.test(src));

		const breadcrumbs = Array.from(document.querySelectorAll('nav a, [class*="readcrumb"] a'))
			.map((a) => a.textContent?.trim() || '')
			.filter(Boolean);

		return {
			url: location.href.split('?')[0],
			title: text(document.querySelector('h1')),
			priceText: text(document.querySelector('[class*="rice"], [data-testid*="rice"]')),
			specs,
			images: Array.from(new Set(images)).slice(0, 10),
			dealer: text(document.querySelector('[class*="ealer"] [class*="ame"], [data-testid*="ealer"]')),
			location: text(document.querySelector('[class*="ocation"], [data-testid*="ocation"]')),
			breadcrumbs,
			jsonLd
		} satisfies RawScrape;
	});
}
