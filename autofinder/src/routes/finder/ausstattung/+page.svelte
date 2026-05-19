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

	function toggle(key: string) {
		searchInputs.update((s) => {
			const features = s.features.includes(key)
				? s.features.filter((f) => f !== key)
				: [...s.features, key];
			return { ...s, features };
		});
	}

	function reset() {
		searchInputs.update((s) => ({ ...s, features: [] }));
	}

	let count = $derived($searchInputs.features.length);
</script>

<svelte:head>
	<title>Ausstattung – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame
	currentStep={5}
	backHref="/finder/marken"
	nextHref="/finder/prioritaeten"
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

	<div class="mt-6 flex items-center gap-3 text-sm text-gray-500">
		<span>{count} Ausstattungsmerkmale ausgewählt</span>
		{#if count > 0}
			<button onclick={reset} class="text-gray-400 underline hover:text-gray-600">
				Zurücksetzen
			</button>
		{/if}
	</div>
</QuestionnaireFrame>
