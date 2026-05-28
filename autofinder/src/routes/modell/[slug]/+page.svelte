<script lang="ts">
	import { page } from '$app/stores';
	import { getCarBySlug } from '$lib/data/mockCars';
	import { getMinPrice, getPrimaryOffer } from '$lib/utils/matching';
	import MatchScore from '$lib/components/MatchScore.svelte';

	const car = $derived(getCarBySlug($page.params.slug ?? ''));

	const drivetrainLabel: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};

	const primary = $derived(car ? getPrimaryOffer(car) : undefined);
	const consumptionUnit = $derived(primary?.drivetrain === 'electric' ? 'kWh/100km' : 'L/100km');
	const priceFrom = $derived(car ? (getMinPrice(car) ?? 0) : 0);

	const PROVIDERS = [
		{
			name: 'AutoScout24',
			type: 'Gelegenheiten & Occasionen',
			priceNote: 'Gebrauchtmarkt — Preise variieren',
			availability: 'sofort verfügbar',
			recommended: false
		},
		{
			name: 'Hersteller-Konfigurator',
			type: 'Neuwagen direkt konfigurieren',
			priceNote: 'ab Listenpreis + Optionen',
			availability: 'Lieferzeit 8–16 Wochen',
			recommended: false
		},
		{
			name: 'AutoFinder Partner',
			type: 'Empfohlener Händler in deiner Region',
			priceNote: 'Sonderkonditionen für AutoFinder-Nutzer',
			availability: '2–4 Fahrzeuge verfügbar',
			recommended: true
		}
	];
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
				class="flex h-[150px] w-[240px] flex-shrink-0 items-center justify-center rounded-card bg-gray-100 text-gray-300"
			>
				<svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z" />
				</svg>
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
					<MatchScore score={87} />
				</div>

				<div class="mt-4 flex gap-3">
					<a
						href="/meine-suchen"
						class="rounded-card border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-gray-400"
					>
						Speichern
					</a>
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
			<div class="mt-3 rounded-card border border-gray-200 bg-gray-50 p-5">
				<p class="leading-relaxed text-gray-700">{car.detailText}</p>
			</div>
		</div>

		<!-- Technische Daten -->
		<div class="mt-10">
			<p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Technische Daten</p>
			<div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
				<div class="rounded-card border border-gray-200 bg-white p-4 shadow-card">
					<p class="text-xs text-gray-400">Leistung</p>
					<p class="mt-1 text-xl font-medium text-gray-900">{primary?.power} PS</p>
				</div>
				<div class="rounded-card border border-gray-200 bg-white p-4 shadow-card">
					<p class="text-xs text-gray-400">Verbrauch</p>
					<p class="mt-1 text-xl font-medium text-gray-900">{primary?.consumption}</p>
					<p class="text-xs text-gray-400">{consumptionUnit}</p>
				</div>
				<div class="rounded-card border border-gray-200 bg-white p-4 shadow-card">
					<p class="text-xs text-gray-400">Kofferraum</p>
					<p class="mt-1 text-xl font-medium text-gray-900">{primary?.trunkSize} L</p>
				</div>
				<div class="rounded-card border border-gray-200 bg-white p-4 shadow-card">
					<p class="text-xs text-gray-400">Garantie</p>
					<p class="mt-1 text-xl font-medium text-gray-900">{car.warranty} Jahre</p>
				</div>
			</div>
		</div>

		<!-- Angebote -->
		<div class="mt-10">
			<p class="text-xs font-semibold uppercase tracking-widest text-gray-400">Aktuelle Angebote</p>
			<div class="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
				{#each PROVIDERS as p}
					<div
						class="rounded-card border bg-white p-4 shadow-card"
						class:border-primary={p.recommended}
						class:border-gray-200={!p.recommended}
					>
						{#if p.recommended}
							<span class="mb-2 inline-block rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-white">
								Empfohlener Partner
							</span>
						{/if}
						<p class="font-medium text-gray-900">{p.name}</p>
						<p class="mt-0.5 text-xs text-gray-400">{p.type}</p>
						<p class="mt-2 text-sm font-medium text-gray-700">{p.priceNote}</p>
						<p class="text-xs text-gray-400">{p.availability}</p>
						<button class="mt-4 w-full rounded-card bg-gray-900 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700">
							Angebot ansehen →
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Weitere Specs -->
		<div class="mt-8 rounded-card border border-gray-200 bg-white p-4 shadow-card">
			<div class="grid grid-cols-3 gap-4 text-sm">
				<div>
					<p class="text-gray-400">CO₂</p>
					<p class="font-medium text-gray-900">{primary?.co2 === 0 ? '0 (elektrisch)' : `${primary?.co2} g/km`}</p>
				</div>
				<div>
					<p class="text-gray-400">Sitze</p>
					<p class="font-medium text-gray-900">{primary?.seats}</p>
				</div>
				<div>
					<p class="text-gray-400">Herkunft</p>
					<p class="font-medium text-gray-900">{{ europe: 'Europa', asia: 'Asien', america: 'Amerika' }[car.region]}</p>
				</div>
			</div>
		</div>
	</div>
{/if}
