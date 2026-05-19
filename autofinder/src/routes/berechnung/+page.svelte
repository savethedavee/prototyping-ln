<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const CHECKS = [
		'Budget & Antrieb gefiltert',
		'Nutzungsprofil abgeglichen',
		'Marken & Ausstattung berücksichtigt',
		'Prioritäten gewichtet',
		'Empfehlungen sortiert'
	];

	let doneCount = $state(0);
	let barWidth = $state(10);

	onMount(() => {
		const timers: ReturnType<typeof setTimeout>[] = [];

		CHECKS.forEach((_, i) => {
			timers.push(
				setTimeout(
					() => {
						doneCount = i + 1;
						barWidth = 20 + (i + 1) * 15;
					},
					350 + i * 280
				)
			);
		});

		timers.push(setTimeout(() => goto('/ergebnisse'), 2200));

		return () => timers.forEach(clearTimeout);
	});
</script>

<svelte:head>
	<title>Berechnung – AutoFinder</title>
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
	<!-- Logo -->
	<a href="/" class="mb-16 text-xl font-bold tracking-tight text-gray-900">
		Auto<span class="text-primary">Finder</span>
	</a>

	<div class="w-full max-w-md text-center">
		<p class="text-xs font-semibold uppercase tracking-widest text-primary">Einen Moment bitte</p>
		<h1 class="mt-3 text-2xl font-medium text-gray-900">
			Wir suchen die passenden Modelle für dich
		</h1>
		<p class="mt-2 text-sm text-gray-400">
			Wir vergleichen 850 Modelle mit deinen Angaben
		</p>

		<!-- Progress bar -->
		<div class="mt-10 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
			<div
				class="h-1.5 rounded-full bg-primary transition-all duration-500"
				style="width: {barWidth}%"
			></div>
		</div>

		<!-- Checklist -->
		<ul class="mt-8 space-y-3 text-left">
			{#each CHECKS as check, i}
				<li class="flex items-center gap-3 text-sm transition-opacity duration-300"
					class:opacity-100={i < doneCount}
					class:opacity-30={i >= doneCount}
				>
					<span
						class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs"
						class:bg-success={i < doneCount}
						class:text-white={i < doneCount}
						class:bg-gray-200={i >= doneCount}
						class:text-gray-400={i >= doneCount}
					>
						{#if i < doneCount}✓{:else}○{/if}
					</span>
					<span class:text-gray-700={i < doneCount} class:text-gray-400={i >= doneCount}>
						{check}
					</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
