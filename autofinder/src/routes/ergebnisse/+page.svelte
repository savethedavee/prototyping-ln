<script lang="ts">
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { get } from 'svelte/store';
	import { searchInputs, persistSearchInputs, editingSearchId, setEditingSearchId } from '$lib/stores/questionnaire';
	import { matchBreakdown, matchScore } from '$lib/utils/matching';
	import CarCard from '$lib/components/CarCard.svelte';
	import type { CarModelWithScore } from '$lib/types';
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();


	persistSearchInputs();
	const inputs = get(searchInputs);

	// If we arrived here via "Bearbeiten", we're editing an existing saved search.
	let editingId = $state(browser ? get(editingSearchId) : null);


	const results: CarModelWithScore[] = data.cars
		.map((car) => ({ ...car, matchScore: matchScore(car, inputs) }))
		.filter((car) => car.matchScore >= 1)
		.sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 30);;

	// Debug: übersichtliche Score-Aufschlüsselung aller Modelle in der Konsole.
	if (browser) {
		const rows = data.cars
			.map((car) => {
				const b = matchBreakdown(car, inputs);
				return {
					Modell: car.name,
					Total: b.total,
					Basis: b.base,
					Nutzung: b.usage,
					Marke: b.brand,
					Prioritäten: b.priorities,
					Budget: b.budget,
					Farbe: b.color,
					Angebote: b.relevantOffers,
					Grund: b.reason ?? ''
				};
			})
			.sort((a, b) => b.Total - a.Total);
		console.groupCollapsed(`🎯 Match-Scores — ${rows.length} Modelle (Eingaben siehe unten)`);
		console.log('Such-Eingaben:', inputs);
		console.table(rows);
		console.groupEnd();
	}


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

	<!-- Suche speichern / aktualisieren -->
	{#if form?.saved}
		<div
			class="mb-6 flex items-center gap-2 rounded-card border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
		>
			<svg class="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<span>{form.updated ? 'Änderungen gespeichert' : 'Suche gespeichert'}</span>
			<a href="/meine-suchen" class="ml-1 underline hover:text-green-800">Zu „Meine Suchen"</a>
		</div>
	{:else}
		<form
			method="POST"
			action="?/saveSearch"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					if (editingId) {
						editingId = null;
						setEditingSearchId(null);
					}
				};
			}}
			class="mb-6 flex flex-wrap items-center gap-3 rounded-card border border-gray-200 bg-white p-4 shadow-card"
		>
			<input type="hidden" name="inputs" value={JSON.stringify(inputs)} />
			<input type="hidden" name="editingId" value={editingId ?? ''} />
			{#if editingId}
				<span class="text-sm font-medium text-gray-700">Du bearbeitest eine gespeicherte Suche</span>
				<button
					type="submit"
					class="rounded-card bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
				>
					Änderungen speichern
				</button>
			{:else}
				<label for="searchName" class="text-sm font-medium text-gray-700">Diese Suche speichern</label>
				<input
					id="searchName"
					name="name"
					type="text"
					required
					placeholder="z. B. Familienauto Hybrid"
					class="min-w-[12rem] flex-1 rounded-card border border-gray-300 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
				/>
				<button
					type="submit"
					class="rounded-card bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
				>
					Speichern
				</button>
			{/if}
			{#if form?.error}
				<span class="text-sm text-red-600">{form.error}</span>
			{/if}
		</form>
	{/if}

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
