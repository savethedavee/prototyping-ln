<script lang="ts">
	import { get } from 'svelte/store';
	import { searchInputs } from '$lib/stores/questionnaire';
	import { goto } from '$app/navigation';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const SLIDERS = [
		{ key: 'consumption', label: 'Niedriger Verbrauch', hint: 'spart laufende Kosten' },
		{ key: 'power', label: 'Leistung & PS', hint: 'Beschleunigung, Überholen' },
		{ key: 'comfort', label: 'Komfort', hint: 'Federung, Geräusch, Sitze' },
		{ key: 'safety', label: 'Sicherheit', hint: 'Crash-Tests, Assistenten' },
		{ key: 'design', label: 'Design & Image', hint: 'Optik, Marke, Status' }
	] as const;

	type SliderKey = (typeof SLIDERS)[number]['key'];

	const initial = get(searchInputs).priorities;
	let values = $state<Record<SliderKey, number>>({ ...initial });

	$effect(() => {
		searchInputs.update((s) => ({ ...s, priorities: { ...values } }));
	});

	function handleNext() {
		goto('/berechnung');
	}
</script>

<svelte:head>
	<title>Prioritäten – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame currentStep={6} backHref="/finder/ausstattung">
	<h1 class="text-2xl font-medium text-gray-900">Was zählt für dich am meisten?</h1>
	<p class="mt-2 text-sm text-gray-500">Stelle die Schieberegler auf 1 (unwichtig) bis 5 (sehr wichtig).</p>

	<div class="mt-10 space-y-6">
		{#each SLIDERS as slider}
			<div class="flex items-center gap-4">
				<div class="w-40 flex-shrink-0">
					<p class="text-sm font-medium text-gray-900">{slider.label}</p>
					<p class="text-xs text-gray-400">{slider.hint}</p>
				</div>
				<input
					type="range"
					min="1"
					max="5"
					step="1"
					bind:value={values[slider.key]}
					class="priority-slider flex-1"
				/>
				<span class="w-10 text-right text-sm font-medium text-gray-700">
					{values[slider.key]} / 5
				</span>
			</div>
		{/each}
	</div>

	<!-- Override next button via action -->
	<div class="mt-10 flex justify-end">
		<button
			onclick={handleNext}
			class="rounded-card bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
		>
			Empfehlungen ansehen →
		</button>
	</div>
</QuestionnaireFrame>

<style>
	.priority-slider {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		border-radius: 9999px;
		background: #e5e7eb;
		outline: none;
		cursor: pointer;
	}

	.priority-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #111827;
		border: 2px solid white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}

	.priority-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #111827;
		border: 2px solid white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
		cursor: pointer;
	}
</style>
