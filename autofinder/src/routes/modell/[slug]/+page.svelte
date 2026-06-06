<script lang="ts">
	import { get } from 'svelte/store';
	import { searchInputs } from '$lib/stores/questionnaire';
	import { getImageUrl, getMinPrice, getPrimaryOffer, matchReasons, matchScore } from '$lib/utils/matching';
	import OfferGallery from '$lib/components/OfferGallery.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { CarOffer } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const car = $derived(data.car);
	const score = $derived(car ? matchScore(car, get(searchInputs)) : 0);
	const reasons = $derived(car ? matchReasons(car, get(searchInputs)) : []);

	const drivetrainLabel: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};
	const conditionLabel: Record<string, string> = { new: 'Neu', used: 'Gebraucht' };
	const transmissionLabel: Record<string, string> = {
		manual: 'Manuell',
		automatic: 'Automat',
		dct: 'Doppelkupplung'
	};

	const primary = $derived(car ? getPrimaryOffer(car) : undefined);
	const priceFrom = $derived(car ? (getMinPrice(car) ?? 0) : 0);
	const image = $derived(car ? getImageUrl(car) : undefined);
	let imgFailed = $state(false);

	// Real scraped offers, cheapest first. Listings with identical content (same
	// price, mileage, dealer, …) are collapsed — dealers often post the same car
	// multiple times under different listing IDs.
	const offers = $derived.by(() => {
		const seen = new Set<string>();
		const unique = [];
		for (const o of car?.offers ?? []) {
			const key = [
				o.price,
				o.mileage,
				o.year,
				o.dealer,
				o.location,
				o.transmission,
				o.drivetrain,
				o.power,
				o.color
			].join('|');
			if (seen.has(key)) continue;
			seen.add(key);
			unique.push(o);
		}
		return unique.sort((a, b) => a.price - b.price);
	});

	// Technical values now live inside each offer card. Only set values are
	// listed, so sparse listings don't render empty "L/100km" / "0 PS" chips.
	function offerSpecs(o: CarOffer): { label: string; value: string }[] {
		const unit = o.drivetrain === 'electric' ? 'kWh/100km' : 'L/100km';
		const s: { label: string; value: string }[] = [];
		if (o.power) s.push({ label: 'Leistung', value: `${o.power} PS` });
		if (o.consumption != null) s.push({ label: 'Verbrauch', value: `${o.consumption} ${unit}` });
		if (o.trunkSize) s.push({ label: 'Kofferraum', value: `${o.trunkSize} L` });
		if (o.co2 != null) s.push({ label: 'CO₂', value: o.co2 === 0 ? '0 (elektrisch)' : `${o.co2} g/km` });
		if (o.seats) s.push({ label: 'Sitze', value: `${o.seats} Sitze` });
		return s;
	}
</script>

<svelte:head>
	<title>{car?.name ?? 'Modell'} – AutoFinder</title>
</svelte:head>

{#if !car}
	<div class="mx-auto max-w-2xl px-4 py-20 text-center">
		<h1 class="text-xl font-medium text-gray-900">Modell nicht gefunden</h1>
		<a href="/ergebnisse" class="mt-4 inline-block text-sm text-primary hover:underline">
			← Zurück zur Ergebnisliste
		</a>
	</div>
{:else}
	<div class="mx-auto max-w-4xl px-4 py-8">
		<!-- Breadcrumb -->
		<a href="/ergebnisse" class="text-sm text-gray-400 hover:text-gray-700">
			← Zurück zu den Empfehlungen
		</a>

		<!-- Hero -->
		<div class="mt-6 flex items-start gap-8">
			<div
				class="flex h-[150px] w-[240px] flex-shrink-0 items-center justify-center overflow-hidden rounded-card bg-gray-100 text-gray-300"
			>
				{#if image && !imgFailed}
					<img
						src={image}
						alt={car.name}
						class="h-full w-full object-cover"
						onerror={() => (imgFailed = true)}
					/>
				{:else}
					<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z" />
					</svg>
				{/if}
			</div>

			<div class="flex-1">
				<div class="flex items-start justify-between">
					<div>
						<h1 class="text-2xl font-medium text-gray-900">{car.name}</h1>
						<div class="mt-2 flex items-center gap-2">
							<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{car.type}</span>
							<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{drivetrainLabel[primary?.drivetrain ?? 'combustion']}</span>
						</div>
						<p class="mt-2 text-lg font-medium text-gray-900">
							ab CHF {priceFrom.toLocaleString('de-CH')}
						</p>
					</div>
					<span
						class="flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-sm font-semibold tabular-nums"
						class:bg-green-100={score >= 80}
						class:text-green-700={score >= 80}
						class:bg-primary-light={score < 80}
						class:text-primary={score < 80}
					>
						{score}&nbsp;% Match
					</span>
				</div>

				<div class="mt-4 flex gap-3">
					<a
						href="/ergebnisse"
						class="rounded-card border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400"
					>
						+ Vergleich
					</a>
				</div>
			</div>
		</div>

		<!-- Was das für dich bedeutet -->
		<div class="mt-10">
			<p class="text-xs font-semibold uppercase tracking-widest text-primary">Was das für dich bedeutet</p>
			{#if reasons.length > 0}
				<ul class="mt-4 space-y-3">
					{#each reasons as r}
						<li class="flex items-start gap-3">
							<svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							<span class="leading-snug">
								<span class="font-medium text-gray-900">{r.label}</span>
								<span class="text-gray-500"> — {r.detail}</span>
							</span>
						</li>
					{/each}
				</ul>
			{/if}
			{#if car.detailText}
				<div
					class="rounded-card border border-gray-200 bg-gray-50 p-5"
					class:mt-6={reasons.length > 0}
					class:mt-3={reasons.length === 0}
				>
					<p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Über das Modell</p>
					<p class="mt-2 leading-relaxed text-gray-700">{car.detailText}</p>
				</div>
			{/if}
		</div>

		<!-- Angebote -->
		<div class="mt-10">
			<p class="text-sm font-semibold uppercase tracking-widest text-gray-500">
				Aktuelle Angebote{#if offers.length > 0} ({offers.length}){/if}
			</p>
			{#if offers.length === 0}
				<p class="mt-4 text-base text-gray-500">
					Aktuell liegen keine Angebote für dieses Modell vor.
				</p>
			{:else}
				<div class="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2">
					{#each offers as offer}
						{@const specs = offerSpecs(offer)}
						<div class="flex flex-col rounded-card border border-gray-200 bg-white p-6 shadow-card">
							<OfferGallery images={offer.images ?? []} alt={car.name} />
							<div class="mt-4 flex items-center justify-between">
								<span
									class="rounded-full px-2.5 py-0.5 text-xs font-medium"
									class:bg-blue-50={offer.condition === 'new'}
									class:text-blue-700={offer.condition === 'new'}
									class:bg-gray-100={offer.condition === 'used'}
									class:text-gray-500={offer.condition === 'used'}
								>
									{conditionLabel[offer.condition]}
								</span>
								{#if offer.year}
									<span class="text-sm text-gray-400">{offer.year}</span>
								{/if}
							</div>
							<p class="mt-2 text-3xl font-semibold text-gray-900">
								CHF {offer.price.toLocaleString('de-CH')}
							</p>
							<div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
								{#if offer.mileage != null}
									<span>{offer.mileage.toLocaleString('de-CH')} km</span>
								{/if}
								{#if offer.transmission}
									<span>{transmissionLabel[offer.transmission]}</span>
								{/if}
								{#if offer.drivetrain}
									<span>{drivetrainLabel[offer.drivetrain]}</span>
								{/if}
							</div>

							<!-- Technische Werte dieses Angebots -->
							{#if specs.length > 0}
								<dl class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-gray-100 pt-4 text-sm">
									{#each specs as spec}
										<div class="flex items-baseline justify-between gap-2">
											<dt class="text-gray-400">{spec.label}</dt>
											<dd class="font-medium text-gray-900">{spec.value}</dd>
										</div>
									{/each}
								</dl>
							{/if}

							{#if offer.dealer || offer.location}
								<p class="mt-3 text-sm text-gray-500">
									{[offer.dealer, offer.location].filter(Boolean).join(' · ')}
								</p>
							{/if}
							<div class="mt-auto pt-6">
								{#if offer.url}
									<a
										href={offer.url}
										target="_blank"
										rel="noopener noreferrer"
										class="block w-full rounded-card bg-gray-900 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-gray-700"
									>
										Angebot ansehen →
									</a>
								{:else}
									<span class="block w-full rounded-card bg-gray-100 py-3 text-center text-sm font-medium text-gray-400">
										Kein Link verfügbar
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<div class="mt-auto">
	<Footer />
</div>
