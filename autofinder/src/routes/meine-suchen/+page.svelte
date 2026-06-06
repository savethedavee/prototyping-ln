<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		searchInputs,
		persistSearchInputs,
		setEditingSearchId
	} from '$lib/stores/questionnaire';
	import type { SavedSearch } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let renamingId = $state<string | null>(null);

	const USAGE: Record<string, string> = {
		commute: 'Pendeln',
		family: 'Familie',
		leisure: 'Freizeit',
		city: 'Stadt',
		commercial: 'Gewerbe',
		sport: 'Sport'
	};
	const DRIVETRAIN: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};
	const BODYTYPE: Record<string, string> = {
		suv: 'SUV',
		kombi: 'Kombi',
		limousine: 'Limousine',
		kompakt: 'Kompakt',
		kleinwagen: 'Kleinwagen',
		van: 'Van',
		coupe: 'Coupé',
		cabrio: 'Cabriolet'
	};
	const REGION: Record<string, string> = {
		europe: 'Europa',
		asia: 'Asien',
		america: 'Amerika',
		any: 'Egal'
	};
	const CONDITION: Record<string, string> = { new: 'Neu', used: 'Gebraucht', any: 'Egal' };
	const PRIORITY: Record<string, string> = {
		consumption: 'Verbrauch',
		power: 'Leistung',
		comfort: 'Komfort',
		safety: 'Sicherheit',
		design: 'Design'
	};

	function budgetLabel(i: SavedSearch['inputs']): string {
		const max = i.budgetMax >= 100000 ? "100'000+" : i.budgetMax.toLocaleString('de-CH');
		return `CHF ${i.budgetMin.toLocaleString('de-CH')} – ${max}`;
	}

	function map(keys: string[] | undefined, dict: Record<string, string>): string {
		return (keys ?? []).map((k) => dict[k] ?? k).join(', ');
	}

	/** Build labeled detail entries, omitting empty/irrelevant ones. */
	function details(s: SavedSearch): { label: string; value: string }[] {
		const i = s.inputs;
		const out: { label: string; value: string }[] = [];
		out.push({ label: 'Budget', value: budgetLabel(i) });
		out.push({ label: 'Zustand', value: CONDITION[i.condition] ?? i.condition });
		if (i.usage?.length) out.push({ label: 'Nutzung', value: map(i.usage, USAGE) });
		if (i.drivetrain?.length) out.push({ label: 'Antrieb', value: map(i.drivetrain, DRIVETRAIN) });
		if (i.bodyTypes?.length) out.push({ label: 'Karosserie', value: map(i.bodyTypes, BODYTYPE) });
		if (i.brandRegion && i.brandRegion !== 'any')
			out.push({ label: 'Region', value: REGION[i.brandRegion] ?? i.brandRegion });
		if (i.brands?.length) out.push({ label: 'Marken', value: i.brands.join(', ') });
		if (i.colors?.length) out.push({ label: 'Farben', value: i.colors.join(', ') });
		const prios = Object.entries(i.priorities ?? {})
			.filter(([, v]) => v >= 4)
			.map(([k]) => PRIORITY[k] ?? k);
		if (prios.length) out.push({ label: 'Wichtig', value: prios.join(', ') });
		return out;
	}

	function formatDate(d: Date | string): string {
		return new Date(d).toLocaleDateString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function openSearch(s: SavedSearch) {
		searchInputs.set(s.inputs);
		setEditingSearchId(null);
		persistSearchInputs();
		goto('/ergebnisse');
	}

	function editSearch(s: SavedSearch) {
		searchInputs.set(s.inputs);
		setEditingSearchId(s._id ?? null);
		persistSearchInputs();
		goto('/finder/budget');
	}
</script>

<svelte:head>
	<title>Meine Suchen – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-medium text-gray-900">Meine Suchen</h1>
			<p class="mt-1 text-sm text-gray-500">
				{data.searches.length}
				{data.searches.length === 1 ? 'gespeichertes Such-Profil' : 'gespeicherte Such-Profile'}
			</p>
		</div>
		<a
			href="/finder/budget"
			class="rounded-card bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
		>
			+ Neue Suche
		</a>
	</div>

	{#if data.searches.length === 0}
		<div class="mt-10 rounded-card border border-dashed border-gray-300 bg-white p-12 text-center">
			<p class="text-gray-400">Noch keine gespeicherten Suchen.</p>
			<p class="mt-1 text-sm text-gray-400">
				Starte eine Suche und speichere sie, um sie hier wiederzufinden.
			</p>
			<a
				href="/finder/budget"
				class="mt-6 inline-block rounded-card bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
			>
				Suche starten →
			</a>
		</div>
	{:else}
		<div class="mt-8 space-y-4">
			{#each data.searches as search (search._id)}
				<div class="overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
					<!-- Header -->
					<div class="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
						{#if renamingId === search._id}
							<form
								method="POST"
								action="?/rename"
								use:enhance={() => async ({ update }) => {
									await update({ reset: false });
									renamingId = null;
								}}
								class="flex flex-1 items-center gap-2"
							>
								<input type="hidden" name="id" value={search._id} />
								<!-- svelte-ignore a11y_autofocus -->
								<input
									name="name"
									value={search.name}
									autofocus
									required
									class="flex-1 rounded-card border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-400 focus:outline-none"
								/>
								<button type="submit" class="rounded-card bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700">
									Speichern
								</button>
								<button type="button" onclick={() => (renamingId = null)} class="px-2 text-xs text-gray-400 hover:text-gray-600">
									Abbrechen
								</button>
							</form>
						{:else}
							<div class="min-w-0">
								<h2 class="truncate text-lg font-medium text-gray-900">{search.name}</h2>
								<p class="mt-0.5 text-xs text-gray-400">Gespeichert am {formatDate(search.createdAt)}</p>
							</div>
							<button
								type="button"
								onclick={() => (renamingId = search._id ?? null)}
								class="flex-shrink-0 text-xs text-gray-400 transition-colors hover:text-primary"
							>
								Umbenennen
							</button>
						{/if}
					</div>

					<!-- Details -->
					<dl class="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-4 sm:grid-cols-3">
						{#each details(search) as d}
							<div class="min-w-0">
								<dt class="text-xs text-gray-400">{d.label}</dt>
								<dd class="truncate text-sm text-gray-800" title={d.value}>{d.value}</dd>
							</div>
						{/each}
					</dl>

					<!-- Actions -->
					<div class="flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3">
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={search._id} />
							<button
								type="submit"
								class="rounded-card px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
							>
								Löschen
							</button>
						</form>
						<button
							type="button"
							onclick={() => editSearch(search)}
							class="rounded-card border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-400"
						>
							Bearbeiten
						</button>
						<button
							type="button"
							onclick={() => openSearch(search)}
							class="rounded-card bg-gray-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700"
						>
							Öffnen →
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
