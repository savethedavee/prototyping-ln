<script lang="ts">
	import { searchInputs } from '$lib/stores/questionnaire';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const OPTIONS = [
		{
			key: 'commute',
			label: 'Pendeln zur Arbeit',
			sub: 'Tägliche Strecke, oft Stadt + Autobahn',
			icon: '🚗'
		},
		{
			key: 'family',
			label: 'Familie & Kinder',
			sub: 'Platz, Sicherheit, Kindersitze',
			icon: '👨‍👩‍👧'
		},
		{
			key: 'leisure',
			label: 'Freizeit & Reisen',
			sub: 'Wochenend-Trips, Sport, Gepäck',
			icon: '🧳'
		},
		{
			key: 'city',
			label: 'Stadt & Kurzstrecke',
			sub: 'Wendig, einparken, sparsam',
			icon: '🏙️'
		},
		{
			key: 'commercial',
			label: 'Gewerblich / Anhänger',
			sub: 'Zugkraft, Ladevolumen, Robustheit',
			icon: '🔧'
		},
		{
			key: 'sport',
			label: 'Sport & Fahrspass',
			sub: 'Performance, Handling, Emotion',
			icon: '🏎️'
		}
	];

	function toggle(key: string) {
		searchInputs.update((s) => {
			const usage = s.usage.includes(key) ? s.usage.filter((k) => k !== key) : [...s.usage, key];
			return { ...s, usage };
		});
	}

	let canNext = $derived($searchInputs.usage.length > 0);
</script>

<svelte:head>
	<title>Nutzung – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame
	currentStep={2}
	backHref="/finder/budget"
	nextHref="/finder/antrieb"
	{canNext}
>
	<h1 class="text-2xl font-medium text-gray-900">Wofür brauchst du das Auto?</h1>
	<p class="mt-2 text-sm text-gray-500">Mehrfachauswahl möglich — wähle alles, was zutrifft.</p>

	<div class="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
		{#each OPTIONS as opt}
			{@const selected = $searchInputs.usage.includes(opt.key)}
			<button
				onclick={() => toggle(opt.key)}
				class="relative rounded-card border p-4 text-left transition-all"
				class:border-gray-900={selected}
				class:bg-gray-900={selected}
				class:border-gray-200={!selected}
				class:bg-white={!selected}
				class:hover:border-gray-400={!selected}
			>
				{#if selected}
					<span
						class="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-900"
					>
						✓
					</span>
				{/if}
				<span class="text-xl">{opt.icon}</span>
				<p
					class="mt-2 text-sm font-medium"
					class:text-white={selected}
					class:text-gray-900={!selected}
				>
					{opt.label}
				</p>
				<p
					class="mt-1 text-xs"
					class:text-gray-300={selected}
					class:text-gray-400={!selected}
				>
					{opt.sub}
				</p>
			</button>
		{/each}
	</div>

	{#if $searchInputs.usage.length === 0}
		<p class="mt-4 text-xs text-gray-400">Mindestens eine Option auswählen, um fortzufahren.</p>
	{/if}
</QuestionnaireFrame>
