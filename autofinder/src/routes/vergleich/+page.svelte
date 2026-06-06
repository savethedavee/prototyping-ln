<script lang="ts">
	import { get } from 'svelte/store';
	import { searchInputs } from '$lib/stores/questionnaire';
	import { getImageUrl, getMinPrice, getPrimaryOffer, matchScore } from '$lib/utils/matching';
	import Footer from '$lib/components/Footer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const inputs = get(searchInputs);

	const drivetrainLabel: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};
	const bodyLabel: Record<string, string> = {
		suv: 'SUV',
		kombi: 'Kombi',
		limousine: 'Limousine',
		kompakt: 'Kompakt',
		kleinwagen: 'Kleinwagen',
		van: 'Van',
		coupe: 'Coupé',
		cabrio: 'Cabrio'
	};
	const regionLabel: Record<string, string> = { europe: 'Europa', asia: 'Asien', america: 'Amerika' };

	const featureLabel: Record<string, string> = {
		climate: 'Klimaautomatik', seatHeating: 'Sitzheizung', steeringWheelHeating: 'Lenkradheizung',
		leather: 'Ledersitze', panoramaRoof: 'Panoramadach', sportSeats: 'Sportsitze',
		rearCam: 'Rückfahrkamera', adaptiveCruise: 'Adaptiver Tempomat', laneAssist: 'Spurhalteassistent',
		blindSpot: 'Toter-Winkel-Warner', surroundCam: '360°-Kamera', parkAssist: 'Einparkassistent',
		carplay: 'Apple CarPlay / Android Auto', navigation: 'Navigationssystem', premiumSound: 'Premium-Sound',
		hud: 'Head-up-Display', wirelessCharging: 'Wireless Charging', towHitch: 'Anhängerkupplung',
		awd: 'Allradantrieb', roofRails: 'Dachreling', electricTailgate: 'Elektr. Heckklappe', sunroof: 'Schiebedach'
	};

	// One view-model per car with everything the table needs.
	const cars = $derived(
		data.cars.map((car) => ({
			car,
			primary: getPrimaryOffer(car),
			score: matchScore(car, inputs),
			price: getMinPrice(car) ?? null,
			image: getImageUrl(car),
			features: [...new Set(car.offers.flatMap((o) => o.features ?? []))]
		}))
	);
	type View = (typeof cars)[number];

	type Cell = { text: string; num: number | null };
	type Row = { label: string; best?: 'min' | 'max'; cell: (v: View) => Cell };

	const rows: Row[] = [
		{ label: 'Match', best: 'max', cell: (v) => ({ text: `${v.score} %`, num: v.score }) },
		{
			label: 'Preis ab',
			best: 'min',
			cell: (v) => ({
				text: v.price != null ? `CHF ${v.price.toLocaleString('de-CH')}` : '–',
				num: v.price
			})
		},
		{
			label: 'Antrieb',
			cell: (v) => ({
				text: v.primary?.drivetrain ? drivetrainLabel[v.primary.drivetrain] : '–',
				num: null
			})
		},
		{
			label: 'Leistung',
			best: 'max',
			cell: (v) => ({ text: v.primary?.power ? `${v.primary.power} PS` : '–', num: v.primary?.power ?? null })
		},
		{
			label: 'Verbrauch',
			best: 'min',
			cell: (v) => {
				const c = v.primary?.consumption;
				const unit = v.primary?.drivetrain === 'electric' ? 'kWh' : 'L';
				return { text: c != null ? `${c} ${unit}/100km` : '–', num: c ?? null };
			}
		},
		{
			label: 'Kofferraum',
			best: 'max',
			cell: (v) => ({
				text: v.primary?.trunkSize ? `${v.primary.trunkSize} L` : '–',
				num: v.primary?.trunkSize ?? null
			})
		},
		{
			label: 'Sitze',
			cell: (v) => ({ text: v.primary?.seats ? `${v.primary.seats}` : '–', num: null })
		},
		{
			label: 'CO₂',
			best: 'min',
			cell: (v) => {
				const c = v.primary?.co2;
				return { text: c == null ? '–' : c === 0 ? '0 (elektrisch)' : `${c} g/km`, num: c ?? null };
			}
		},
		{
			label: 'Karosserie',
			cell: (v) => ({
				text: v.primary?.bodyType ? (bodyLabel[v.primary.bodyType] ?? v.primary.bodyType) : '–',
				num: null
			})
		},
		{
			label: 'Garantie',
			best: 'max',
			cell: (v) => ({ text: v.car.warranty ? `${v.car.warranty} Jahre` : '–', num: v.car.warranty || null })
		},
		{ label: 'Herkunft', cell: (v) => ({ text: regionLabel[v.car.region] ?? '–', num: null }) }
	];

	// Indices of the cars that hold the best value in a row (for highlighting).
	function bestSet(cells: Cell[], best?: 'min' | 'max'): Set<number> {
		const s = new Set<number>();
		if (!best) return s;
		const nums = cells.map((c) => c.num).filter((n): n is number => n != null);
		if (nums.length < 2 || nums.every((n) => n === nums[0])) return s;
		const target = best === 'min' ? Math.min(...nums) : Math.max(...nums);
		cells.forEach((c, i) => {
			if (c.num === target) s.add(i);
		});
		return s;
	}
</script>

<svelte:head>
	<title>Vergleich – AutoFinder</title>
</svelte:head>

<div class="mx-auto w-full max-w-5xl px-4 py-10">
	<a href="/ergebnisse" class="text-sm text-gray-400 hover:text-gray-700">← Zurück zu den Empfehlungen</a>

	<div class="mt-4">
		<p class="text-xs font-semibold uppercase tracking-widest text-primary">Direktvergleich</p>
		<h1 class="mt-1 text-2xl font-medium text-gray-900">
			{cars.length} Modelle im Vergleich
		</h1>
	</div>

	{#if cars.length === 0}
		<div class="mt-8 rounded-card border border-gray-200 bg-white p-12 text-center shadow-card">
			<h2 class="text-lg font-medium text-gray-900">Keine Modelle ausgewählt</h2>
			<p class="mt-2 text-sm text-gray-500">
				Wähle in der Ergebnisliste 2–3 Modelle zum Vergleichen aus.
			</p>
			<a
				href="/ergebnisse"
				class="mt-6 inline-block rounded-card bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
			>
				Zur Ergebnisliste
			</a>
		</div>
	{:else}
		<div class="mt-6 overflow-x-auto">
			<table class="w-full min-w-[560px] table-fixed border-collapse">
				<thead>
					<tr>
						<th class="w-28 md:w-36"></th>
						{#each cars as v}
							<th class="p-3 text-left align-top">
								<a href="/modell/{v.car.slug}" class="group block">
									<div
										class="mb-3 flex aspect-[3/2] w-full items-center justify-center overflow-hidden rounded-card bg-gray-100 text-gray-300"
									>
										{#if v.image}
											<img src={v.image} alt={v.car.name} class="h-full w-full object-cover" />
										{:else}
											<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z" />
											</svg>
										{/if}
									</div>
									<p class="font-medium leading-snug text-gray-900 group-hover:text-primary">
										{v.car.name}
									</p>
									<p class="text-xs text-gray-400">{v.car.brand}</p>
								</a>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as row}
						{@const cells = cars.map(row.cell)}
						{@const best = bestSet(cells, row.best)}
						<tr class="border-t border-gray-100">
							<td class="py-3 pr-3 text-sm text-gray-400">{row.label}</td>
							{#each cells as c, i}
								<td
									class="px-3 py-3 text-sm tabular-nums"
									class:font-semibold={best.has(i)}
									class:text-green-700={best.has(i)}
									class:text-gray-900={!best.has(i)}
								>
									{c.text}
								</td>
							{/each}
						</tr>
					{/each}

					<!-- Features (Mehrwert-Zeile, daher außerhalb des Cell-Schemas) -->
					<tr class="border-t border-gray-100 align-top">
						<td class="py-3 pr-3 text-sm text-gray-400">Features</td>
						{#each cars as v}
							<td class="px-3 py-3">
								{#if v.features.length > 0}
									<div class="flex flex-wrap gap-1.5">
										{#each v.features as f}
											<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
												{featureLabel[f] ?? f}
											</span>
										{/each}
									</div>
								{:else}
									<span class="text-sm text-gray-400">–</span>
								{/if}
							</td>
						{/each}
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td></td>
						{#each cars as v}
							<td class="px-3 pt-6 align-top">
								<a
									href="/modell/{v.car.slug}"
									class="block rounded-card bg-gray-900 px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
								>
									Ansehen →
								</a>
							</td>
						{/each}
					</tr>
				</tfoot>
			</table>
		</div>
	{/if}
</div>

<div class="mt-auto">
	<Footer />
</div>
