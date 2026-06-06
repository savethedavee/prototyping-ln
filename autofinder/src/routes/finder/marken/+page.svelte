<script lang="ts">
	import { searchInputs } from '$lib/stores/questionnaire';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const REGIONS = [
		{ key: 'europe', label: 'Europäisch', sub: 'VW, BMW, Mercedes, Audi, Volvo…' },
		{ key: 'asia', label: 'Asiatisch', sub: 'Toyota, Hyundai, Mazda, Honda…' },
		{ key: 'america', label: 'Amerikanisch', sub: 'Ford, Tesla, GM…' },
		{ key: 'any', label: 'Egal', sub: 'Alle Regionen zeigen' }
	];

	const BRANDS_BY_REGION: Record<string, string[]> = {
		europe: ['VW', 'BMW', 'Mercedes', 'Audi', 'Skoda', 'Renault', 'Volvo', 'Fiat', 'Opel', 'Peugeot', 'Seat'],
		asia: ['Toyota', 'Hyundai', 'Mazda', 'Honda', 'Kia'],
		america: ['Tesla', 'Ford']
	};
	const ALL_BRANDS = [...BRANDS_BY_REGION.europe, ...BRANDS_BY_REGION.asia, ...BRANDS_BY_REGION.america];

	let selectedBrands = $derived($searchInputs.brands ?? []);

	// Bei gewählter Region nur deren Marken zeigen; sonst (egal/keine) alle.
	let visibleBrands = $derived(
		!$searchInputs.brandRegion || $searchInputs.brandRegion === 'any'
			? ALL_BRANDS
			: (BRANDS_BY_REGION[$searchInputs.brandRegion] ?? ALL_BRANDS)
	);

	function setRegion(key: string) {
		searchInputs.update((s) => {
			// Bereits gewählte Marken, die nicht zur neuen Region gehören, verwerfen.
			const allowed = key === 'any' ? null : BRANDS_BY_REGION[key];
			const brands = allowed ? (s.brands ?? []).filter((b) => allowed.includes(b)) : (s.brands ?? []);
			return { ...s, brandRegion: key, brands };
		});
	}

	function toggleBrand(brand: string) {
		searchInputs.update((s) => {
			const next = selectedBrands.includes(brand)
				? selectedBrands.filter((b) => b !== brand)
				: [...selectedBrands, brand];
			return { ...s, brands: next };
		});
	}

	function reset() {
		searchInputs.update((s) => ({ ...s, brandRegion: undefined, brands: [] }));
	}
</script>

<svelte:head>
	<title>Marken – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame
	currentStep={4}
	backHref="/finder/antrieb"
	nextHref="/finder/ausstattung"
	onReset={reset}
>
	<h1 class="text-2xl font-medium text-gray-900">Hast du eine Marken-Präferenz?</h1>
	<p class="mt-2 text-sm text-gray-500">Mehrfachauswahl möglich. Kein Muss.</p>

	<h2 class="mt-10 text-sm font-medium uppercase tracking-wider text-gray-400">Region</h2>
	<div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each REGIONS as r}
			{@const selected = $searchInputs.brandRegion === r.key}
			<button
				onclick={() => setRegion(r.key)}
				class="rounded-card border p-3 text-left transition-all"
				class:border-gray-900={selected}
				class:bg-gray-900={selected}
				class:border-gray-200={!selected}
				class:bg-white={!selected}
				class:hover:border-gray-400={!selected}
			>
				<p
					class="text-sm font-medium"
					class:text-white={selected}
					class:text-gray-900={!selected}
				>
					{r.label}
				</p>
				<p
					class="mt-0.5 text-xs"
					class:text-gray-300={selected}
					class:text-gray-400={!selected}
				>
					{r.sub}
				</p>
			</button>
		{/each}
	</div>

	<h2 class="mt-8 text-sm font-medium uppercase tracking-wider text-gray-400">Konkrete Marken</h2>
	<div class="mt-3 flex flex-wrap gap-2">
		{#each visibleBrands as brand}
			{@const selected = selectedBrands.includes(brand)}
			<button
				onclick={() => toggleBrand(brand)}
				class="rounded-full border px-3 py-1.5 text-sm transition-all"
				class:border-gray-900={selected}
				class:bg-gray-900={selected}
				class:text-white={selected}
				class:border-gray-200={!selected}
				class:text-gray-600={!selected}
				class:hover:border-gray-400={!selected}
			>
				{brand}
			</button>
		{/each}
	</div>
</QuestionnaireFrame>
