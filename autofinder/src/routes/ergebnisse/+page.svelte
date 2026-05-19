<script lang="ts">
	import { get } from 'svelte/store';
	import { searchInputs } from '$lib/stores/questionnaire';
	import { mockCars } from '$lib/data/mockCars';
	import CarCard from '$lib/components/CarCard.svelte';
	import type { CarModel, CarModelWithScore, SearchInputs } from '$lib/types';

	function matchScore(car: CarModel, inputs: SearchInputs): number {
		if (car.priceFrom > inputs.budgetMax) return 0;
		if (inputs.drivetrain.length > 0 && !inputs.drivetrain.includes(car.drivetrain)) return 0;
		if (inputs.brandRegion && inputs.brandRegion !== 'any' && car.region !== inputs.brandRegion) {
			return 0;
		}

		let score = 50;

		// Feature match (up to 30 pts)
		if (inputs.features.length > 0) {
			const matches = inputs.features.filter((f) => car.features.includes(f)).length;
			score += (matches / inputs.features.length) * 30;
		} else {
			// No features selected: reward cars with more features slightly
			score += Math.min(18, car.features.length * 1.5);
		}

		// Brand preference bonus
		if (inputs.brands && inputs.brands.length > 0 && inputs.brands.includes(car.brand)) {
			score += 12;
		}

		// Priority: low consumption → prefer electric/hybrid
		if (inputs.priorities.consumption >= 4) {
			if (car.drivetrain === 'electric') score += 7;
			else if (car.drivetrain === 'hybrid') score += 4;
		}

		// Priority: high power
		if (inputs.priorities.power >= 4 && car.power >= 200) score += 5;

		// Budget comfort: car within range
		if (car.priceFrom >= inputs.budgetMin && car.priceFrom <= inputs.budgetMax) score += 3;

		return Math.min(100, Math.round(score));
	}

	const inputs = get(searchInputs);

	const results: CarModelWithScore[] = mockCars
		.map((car) => ({ ...car, matchScore: matchScore(car, inputs) }))
		.filter((car) => car.matchScore >= 60)
		.sort((a, b) => b.matchScore - a.matchScore);

	let compareSet = $state<Set<string>>(new Set());

	function toggleCompare(slug: string) {
		const next = new Set(compareSet);
		if (next.has(slug)) {
			next.delete(slug);
		} else if (next.size < 3) {
			next.add(slug);
		}
		compareSet = next;
	}

	let compareIds = $derived([...compareSet].join(','));

	const drivetrainLabels: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};

	const activeFilters: string[] = [];
	if (inputs.drivetrain.length > 0) {
		activeFilters.push(inputs.drivetrain.map((d) => drivetrainLabels[d]).join(' / '));
	}
	if (inputs.budgetMax < 100000) {
		activeFilters.push(`bis CHF ${inputs.budgetMax.toLocaleString('de-CH')}`);
	}
	if (inputs.brandRegion && inputs.brandRegion !== 'any') {
		activeFilters.push({ europe: 'Europäisch', asia: 'Asiatisch', america: 'Amerikanisch' }[inputs.brandRegion] ?? '');
	}
</script>

<svelte:head>
	<title>Ergebnisse – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10">
	<!-- Header -->
	<div class="mb-6">
		<p class="text-xs font-semibold uppercase tracking-widest text-primary">Deine Empfehlungen</p>
		<h1 class="mt-1 text-2xl font-medium text-gray-900">
			{results.length} Modelle passen zu dir
		</h1>
		{#if activeFilters.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each activeFilters as tag}
					<span class="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{tag}</span>
				{/each}
				<a href="/finder/budget" class="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-gray-400">
					Filter anpassen
				</a>
			</div>
		{/if}
	</div>

	{#if results.length === 0}
		<!-- Empty State -->
		<div class="rounded-card border border-gray-200 bg-white p-12 text-center shadow-card">
			<div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 text-xl">!</div>
			<h2 class="text-lg font-medium text-gray-900">Keine passenden Modelle gefunden</h2>
			<p class="mt-2 text-sm text-gray-500">Deine Filterkriterien sind sehr spezifisch. Versuche, den Suchbereich etwas zu lockern.</p>
			<a href="/finder/budget" class="mt-6 inline-block rounded-card bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
				Filter anpassen
			</a>
		</div>
	{:else}
		<div class="space-y-3">
			{#each results as car}
				<CarCard
					{car}
					isComparing={compareSet.has(car.slug)}
					onToggleCompare={toggleCompare}
				/>
			{/each}
		</div>
	{/if}

	<!-- Neue Suche Link -->
	<div class="mt-8 text-center">
		<a href="/finder/budget" class="text-sm text-gray-400 hover:text-gray-600 underline">
			← Neue Suche starten
		</a>
	</div>
</div>

<!-- Sticky Compare Footer -->
{#if compareSet.size >= 2}
	<div class="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<span class="text-sm text-gray-600">
				{compareSet.size} Modelle zum Vergleichen ausgewählt
			</span>
			<a
				href="/vergleich?ids={compareIds}"
				class="rounded-card bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
			>
				Vergleichen →
			</a>
		</div>
	</div>
{/if}
