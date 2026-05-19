<script lang="ts">
	import { searchInputs } from '$lib/stores/questionnaire';
	import QuestionnaireFrame from '$lib/components/QuestionnaireFrame.svelte';

	const OPTIONS = [
		{
			key: 'combustion',
			label: 'Verbrenner',
			sub: 'Benzin oder Diesel',
			desc: 'Bewährt, grosse Reichweite, einfaches Tanken überall.',
			badge: 'günstigste Anschaffung'
		},
		{
			key: 'hybrid',
			label: 'Hybrid',
			sub: 'Voll- oder Plug-in',
			desc: 'Sparsam in der Stadt, flexibel auf langen Strecken.',
			badge: 'beliebter Mittelweg'
		},
		{
			key: 'electric',
			label: 'Elektro',
			sub: 'Vollelektrisch',
			desc: 'Niedrigste Betriebskosten, leise, ideal für Stadtfahrten.',
			badge: 'günstigster Unterhalt'
		}
	];

	let openToAll = $state($searchInputs.drivetrain.length === 0);

	function toggleOption(key: string) {
		openToAll = false;
		searchInputs.update((s) => {
			const drivetrain = s.drivetrain.includes(key)
				? s.drivetrain.filter((k) => k !== key)
				: [...s.drivetrain, key];
			return { ...s, drivetrain };
		});
	}

	function toggleOpenToAll() {
		openToAll = !openToAll;
		if (openToAll) {
			searchInputs.update((s) => ({ ...s, drivetrain: [] }));
		}
	}
</script>

<svelte:head>
	<title>Antrieb – AutoFinder</title>
</svelte:head>

<QuestionnaireFrame currentStep={3} backHref="/finder/nutzung" nextHref="/finder/marken">
	<h1 class="text-2xl font-medium text-gray-900">Welchen Antrieb bevorzugst du?</h1>
	<p class="mt-2 text-sm text-gray-500">Mehrfachauswahl möglich.</p>

	<div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
		{#each OPTIONS as opt}
			{@const selected = $searchInputs.drivetrain.includes(opt.key)}
			<button
				onclick={() => toggleOption(opt.key)}
				class="rounded-card border p-5 text-left transition-all"
				class:border-gray-900={selected}
				class:bg-gray-900={selected}
				class:border-gray-200={!selected}
				class:bg-white={!selected}
				class:hover:border-gray-400={!selected}
			>
				<div class="flex items-start justify-between">
					<div>
						<p
							class="font-medium"
							class:text-white={selected}
							class:text-gray-900={!selected}
						>
							{opt.label}
						</p>
						<p
							class="text-sm"
							class:text-gray-300={selected}
							class:text-gray-500={!selected}
						>
							{opt.sub}
						</p>
					</div>
					{#if selected}
						<span class="text-white">✓</span>
					{/if}
				</div>
				<p
					class="mt-3 text-sm leading-relaxed"
					class:text-gray-300={selected}
					class:text-gray-500={!selected}
				>
					{opt.desc}
				</p>
				<span
					class="mt-3 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
					class:bg-white={selected}
					class:text-gray-800={selected}
					class:bg-gray-100={!selected}
					class:text-gray-500={!selected}
				>
					{opt.badge}
				</span>
			</button>
		{/each}
	</div>

	<label class="mt-5 flex cursor-pointer items-center gap-3">
		<input
			type="checkbox"
			checked={openToAll}
			onchange={toggleOpenToAll}
			class="h-4 w-4 rounded border-gray-300 text-gray-900"
		/>
		<span class="text-sm text-gray-600">Ich bin offen für alle Antriebsarten</span>
	</label>
</QuestionnaireFrame>
