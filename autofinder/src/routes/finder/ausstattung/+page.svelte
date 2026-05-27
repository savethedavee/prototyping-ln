<script lang="ts">
	import { searchInputs } from '$lib/stores/questionnaire';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const CATEGORIES = [
		{
			label: 'Komfort',
			features: [
				{ key: 'climate', label: 'Klimaautomatik' },
				{ key: 'seatHeating', label: 'Sitzheizung' },
				{ key: 'steeringWheelHeating', label: 'Lenkradheizung' },
				{ key: 'leather', label: 'Ledersitze' },
				{ key: 'panoramaRoof', label: 'Panoramadach' },
				{ key: 'sportSeats', label: 'Sportsitze' }
			]
		},
		{
			label: 'Sicherheit & Assistenz',
			features: [
				{ key: 'rearCam', label: 'Rückfahrkamera' },
				{ key: 'adaptiveCruise', label: 'Adaptiver Tempomat' },
				{ key: 'laneAssist', label: 'Spurhalteassistent' },
				{ key: 'blindSpot', label: 'Toter-Winkel-Warner' },
				{ key: 'surroundCam', label: '360°-Kamera' },
				{ key: 'parkAssist', label: 'Einparkassistent' }
			]
		},
		{
			label: 'Infotainment',
			features: [
				{ key: 'carplay', label: 'Apple CarPlay / Android Auto' },
				{ key: 'navigation', label: 'Navigationssystem' },
				{ key: 'premiumSound', label: 'Premium-Sound' },
				{ key: 'hud', label: 'Head-up-Display' },
				{ key: 'wirelessCharging', label: 'Wireless Charging' }
			]
		},
		{
			label: 'Praktisches',
			features: [
				{ key: 'towHitch', label: 'Anhängerkupplung' },
				{ key: 'awd', label: 'Allradantrieb' },
				{ key: 'roofRails', label: 'Dachreling' },
				{ key: 'electricTailgate', label: 'Elektr. Heckklappe' },
				{ key: 'sunroof', label: 'Schiebedach' }
			]
		}
	];

	const COLORS = [
		{ key: 'schwarz', label: 'Schwarz', hex: '#1a1a1a' },
		{ key: 'weiss', label: 'Weiss', hex: '#f5f5f5', border: true },
		{ key: 'grau', label: 'Grau', hex: '#6b7280' },
		{ key: 'silber', label: 'Silber', hex: '#c0c0c0' },
		{ key: 'blau', label: 'Blau', hex: '#1d4ed8' },
		{ key: 'rot', label: 'Rot', hex: '#dc2626' },
		{ key: 'gruen', label: 'Grün', hex: '#16a34a' },
		{ key: 'braun', label: 'Braun', hex: '#92400e' },
		{ key: 'beige', label: 'Beige', hex: '#d4b483', border: true }
	];

	let count = $derived($searchInputs.features.length);
	let egal = $derived($searchInputs.colors.length === 0);

	function toggle(key: string) {
		searchInputs.update((s) => {
			const features = s.features.includes(key)
				? s.features.filter((f) => f !== key)
				: [...s.features, key];
			return { ...s, features };
		});
	}

	function toggleColor(key: string) {
		searchInputs.update((s) => {
			const colors = s.colors.includes(key)
				? s.colors.filter((k) => k !== key)
				: [...s.colors, key];
			return { ...s, colors };
		});
	}

	function selectEgal() {
		searchInputs.update((s) => ({ ...s, colors: [] }));
	}

	function reset() {
		searchInputs.update((s) => ({ ...s, features: [], colors: [] }));
	}
</script>

<svelte:head>
	<title>Ausstattung & Farbe – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame
	currentStep={5}
	backHref="/finder/marken"
	nextHref="/finder/prioritaeten"
	onReset={reset}
>
	<h1 class="text-2xl font-medium text-gray-900">Welche Ausstattung ist dir wichtig?</h1>
	<p class="mt-2 text-sm text-gray-500">Wähle alles, was du brauchst. Kein Muss.</p>

	<div class="mt-8 space-y-8">
		{#each CATEGORIES as cat}
			<div>
				<h2 class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
					{cat.label}
				</h2>
				<div class="flex flex-wrap gap-2">
					{#each cat.features as feat}
						{@const selected = $searchInputs.features.includes(feat.key)}
						<button
							onclick={() => toggle(feat.key)}
							class="rounded-full border px-3 py-1.5 text-sm transition-all"
							class:border-gray-900={selected}
							class:bg-gray-900={selected}
							class:text-white={selected}
							class:border-gray-200={!selected}
							class:bg-white={!selected}
							class:text-gray-600={!selected}
							class:hover:border-gray-400={!selected}
						>
							{feat.label}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#if count > 0}
		<p class="mt-6 text-sm text-gray-400">{count} Ausstattungsmerkmale ausgewählt</p>
	{/if}

	<hr class="my-10 border-gray-100" />

	<h2 class="text-xs font-semibold uppercase tracking-wider text-gray-400">Farbe</h2>

	<div class="mt-4 flex flex-wrap gap-3">
		<button
			onclick={selectEgal}
			class="flex flex-col items-center gap-1.5 rounded-card border px-3 py-2.5 transition-all"
			class:border-gray-900={egal}
			class:bg-gray-50={egal}
			class:border-gray-200={!egal}
			class:bg-white={!egal}
			class:hover:border-gray-400={!egal}
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200">
				<svg class="h-4 w-4 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M4 8h8" stroke-linecap="round"/>
				</svg>
			</div>
			<span class="text-xs font-medium" class:text-gray-900={egal} class:text-gray-500={!egal}>
				Egal
			</span>
		</button>
		{#each COLORS as color}
			{@const selected = $searchInputs.colors.includes(color.key)}
			<button
				onclick={() => toggleColor(color.key)}
				class="flex flex-col items-center gap-1.5 rounded-card border px-3 py-2.5 transition-all"
				class:border-gray-900={selected}
				class:bg-gray-50={selected}
				class:border-gray-200={!selected}
				class:bg-white={!selected}
				class:hover:border-gray-400={!selected}
			>
				<div
					class="h-8 w-8 rounded-full shadow-sm"
					class:ring-2={selected}
					class:ring-gray-900={selected}
					class:ring-offset-2={selected}
					style="background-color: {color.hex}; {color.border ? 'border: 1px solid #d1d5db;' : ''}"
				></div>
				<span class="text-xs font-medium" class:text-gray-900={selected} class:text-gray-500={!selected}>
					{color.label}
				</span>
			</button>
		{/each}
	</div>
</QuestionnaireFrame>
