<script lang="ts">
	const steps = [
		{
			title: 'Fragebogen ausfüllen',
			description: '6 kurze Fragen zu Budget, Nutzung und Prioritäten – dauert ca. 2 Minuten.'
		},
		{
			title: 'Treffer entdecken',
			description: 'Passende Modelle sortiert nach Übereinstimmung, mit Match-Score in %.'
		},
		{
			title: 'Vergleichen & speichern',
			description: 'Bis zu 3 Modelle nebeneinander vergleichen und Suche für später speichern.'
		}
	];
</script>

<svelte:head>
	<title>AutoFinder – Das passende Auto finden</title>
	<meta name="description" content="Finde dein passendes Auto in wenigen Minuten." />
</svelte:head>

<!-- Hero -->
<section class="bg-white px-4 py-24 text-center">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-5xl font-extrabold tracking-tight text-gray-900">
			Finde dein <span class="text-primary">passendes Auto</span>
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
			Beantworte 6 kurze Fragen zu Budget, Nutzung und Prioritäten – wir zeigen dir die Modelle,
			die am besten zu dir passen.
		</p>
		<a
			href="/questionnaire"
			class="mt-8 inline-block rounded-card bg-primary px-8 py-4 text-lg font-semibold text-white shadow-card transition-colors hover:bg-primary-dark"
		>
			Auto finden →
		</a>
	</div>
</section>

<!-- How it works -->
<section id="how-it-works" class="bg-gray-50 px-4 py-16">
	<div class="mx-auto max-w-5xl">
		<h2 class="mb-10 text-center text-3xl font-bold text-gray-900">So funktioniert's</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each steps as step, i}
				<div class="rounded-card border border-gray-200 bg-white p-6 shadow-card">
					<div class="mb-3 text-4xl font-black text-primary">{i + 1}</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
					<p class="text-sm leading-relaxed text-gray-600">{step.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
