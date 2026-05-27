<script lang="ts">
	import { get } from 'svelte/store';
	import { searchInputs } from '$lib/stores/questionnaire';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const MIN = 5000;
	const MAX = 100000;
	const STEP = 1000;

	const initial = get(searchInputs);
	let minVal = $state(initial.budgetMin);
	let maxVal = $state(initial.budgetMax);

	$effect(() => {
		searchInputs.update((s) => ({ ...s, budgetMin: minVal, budgetMax: maxVal }));
	});

	function handleMinInput(e: Event) {
		const v = Number((e.target as HTMLInputElement).value);
		minVal = Math.min(v, maxVal - STEP);
	}

	function handleMaxInput(e: Event) {
		const v = Number((e.target as HTMLInputElement).value);
		maxVal = Math.max(v, minVal + STEP);
	}

	let minPct = $derived(((minVal - MIN) / (MAX - MIN)) * 100);
	let maxPct = $derived(((maxVal - MIN) / (MAX - MIN)) * 100);

	function fmt(v: number) {
		if (v >= MAX) return "100'000+";
		return `CHF ${v.toLocaleString('de-CH')}`;
	}

	function reset() {
		minVal = 25000;
		maxVal = 45000;
		searchInputs.update((s) => ({ ...s, budgetMin: 25000, budgetMax: 45000, condition: 'any' }));
	}

	const CONDITIONS = [
		{ key: 'new' as const, label: 'Neu' },
		{ key: 'used' as const, label: 'Gebraucht' },
		{ key: 'any' as const, label: 'Egal' }
	];
</script>

<svelte:head>
	<title>Budget – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame currentStep={1} nextHref="/finder/nutzung" onReset={reset}>
	<h1 class="text-2xl font-medium text-gray-900">Was ist dein Budget?</h1>
	<p class="mt-2 text-sm text-gray-500">Wir zeigen dir nur Modelle, die in deinem Preisrahmen liegen.</p>

	<!-- Budget Display -->
	<div class="mt-10 flex items-center justify-between text-lg font-medium text-gray-900">
		<span>{fmt(minVal)}</span>
		<span class="text-sm text-gray-400">bis</span>
		<span>{fmt(maxVal)}</span>
	</div>

	<!-- Dual Range Slider -->
	<div class="relative mt-4 h-6">
		<!-- Track background -->
		<div class="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-200"></div>
		<!-- Track fill -->
		<div
			class="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
			style="left: {minPct}%; right: {100 - maxPct}%"
		></div>
		<!-- Min thumb -->
		<input
			type="range"
			min={MIN}
			max={MAX}
			step={STEP}
			value={minVal}
			oninput={handleMinInput}
			class="slider-thumb absolute w-full"
		/>
		<!-- Max thumb -->
		<input
			type="range"
			min={MIN}
			max={MAX}
			step={STEP}
			value={maxVal}
			oninput={handleMaxInput}
			class="slider-thumb absolute w-full"
		/>
	</div>

	<div class="mt-1 flex justify-between text-xs text-gray-400">
		<span>CHF 5'000</span>
		<span>CHF 100'000+</span>
	</div>

	<!-- Condition -->
	<div class="mt-10">
		<p class="text-sm font-medium text-gray-700">Neu oder Gebraucht?</p>
		<div class="mt-3 flex gap-3">
			{#each CONDITIONS as opt}
				{@const selected = $searchInputs.condition === opt.key}
				<button
					onclick={() => searchInputs.update((s) => ({ ...s, condition: opt.key }))}
					class="rounded-full border px-5 py-2 text-sm font-medium transition-all"
					class:border-gray-900={selected}
					class:bg-gray-900={selected}
					class:text-white={selected}
					class:border-gray-200={!selected}
					class:bg-white={!selected}
					class:text-gray-700={!selected}
					class:hover:border-gray-400={!selected}
				>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Tip -->
	<div class="mt-8 rounded-card border border-blue-100 bg-blue-50 p-4">
		<p class="text-sm text-blue-700">
			<span class="font-medium">Tipp:</span> Plane 10–15 % für laufende Kosten (Versicherung, Service, Treibstoff) zusätzlich ein.
		</p>
	</div>
</QuestionnaireFrame>

<style>
	.slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		pointer-events: none;
		background: transparent;
		position: absolute;
		width: 100%;
		height: 24px;
		top: 50%;
		transform: translateY(-50%);
		margin: 0;
	}

	.slider-thumb::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #111827;
		border: 2px solid white;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
		pointer-events: all;
		cursor: pointer;
	}

	.slider-thumb::-moz-range-thumb {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #111827;
		border: 2px solid white;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
		pointer-events: all;
		cursor: pointer;
		border: none;
	}

	.slider-thumb::-webkit-slider-runnable-track {
		background: transparent;
	}

	.slider-thumb::-moz-range-track {
		background: transparent;
	}
</style>
