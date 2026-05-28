<script lang="ts">
	import type { CarModelWithScore } from '$lib/types';
	import { getMinPrice, getPrimaryOffer } from '$lib/utils/matching';
	import MatchScore from './MatchScore.svelte';

	interface Props {
		car: CarModelWithScore;
		onToggleCompare?: (slug: string) => void;
		isComparing?: boolean;
	}

	let { car, onToggleCompare, isComparing = false }: Props = $props();

	const drivetrainLabel: Record<string, string> = {
		combustion: 'Verbrenner',
		hybrid: 'Hybrid',
		electric: 'Elektro'
	};

	const primary = $derived(getPrimaryOffer(car));
	const drivetrain = $derived(primary?.drivetrain ?? 'combustion');
	const consumptionUnit = $derived(drivetrain === 'electric' ? 'kWh/100km' : 'L/100km');
	const priceFrom = $derived(getMinPrice(car) ?? 0);
</script>

<div
	class="flex items-stretch gap-4 rounded-card border border-gray-200 bg-white p-4 shadow-card transition-shadow hover:shadow-md"
>
	<!-- Image placeholder -->
	<div
		class="flex h-[70px] w-[110px] flex-shrink-0 items-center justify-center rounded bg-gray-100 text-gray-300"
	>
		<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
				d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z"
			/>
		</svg>
	</div>

	<!-- Middle: info -->
	<div class="flex flex-1 flex-col justify-between">
		<div>
			<div class="flex items-center gap-2">
				<span class="font-medium text-gray-900">{car.name}</span>
				<span
					class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"
				>
					{car.type}
				</span>
				<span
					class="rounded-full px-2 py-0.5 text-[11px] font-medium"
					class:bg-green-50={drivetrain === 'electric'}
					class:text-green-700={drivetrain === 'electric'}
					class:bg-blue-50={drivetrain === 'hybrid'}
					class:text-blue-700={drivetrain === 'hybrid'}
					class:bg-gray-100={drivetrain === 'combustion'}
					class:text-gray-500={drivetrain === 'combustion'}
				>
					{drivetrainLabel[drivetrain]}
				</span>
			</div>
			<p class="mt-1 text-sm text-gray-500">{car.description}</p>
		</div>
		<div class="mt-2 flex items-center gap-3 text-xs text-gray-400">
			<span>ab CHF {priceFrom.toLocaleString('de-CH')}</span>
			<span class="text-gray-200">·</span>
			<span>{primary?.consumption} {consumptionUnit}</span>
			<span class="text-gray-200">·</span>
			<span>{primary?.power} PS</span>
		</div>
	</div>

	<!-- Match score -->
	<div class="flex-shrink-0 px-3">
		<MatchScore score={car.matchScore} />
	</div>

	<!-- Actions -->
	<div class="flex flex-shrink-0 flex-col justify-center gap-2">
		{#if onToggleCompare}
			<button
				onclick={() => onToggleCompare(car.slug)}
				class="rounded-card border px-3 py-1.5 text-xs font-medium transition-colors"
				class:border-primary={isComparing}
				class:text-primary={isComparing}
				class:bg-primary-light={isComparing}
				class:border-gray-300={!isComparing}
				class:text-gray-600={!isComparing}
				class:hover:border-gray-400={!isComparing}
			>
				{isComparing ? '✓ Verglichen' : '+ Vergleich'}
			</button>
		{/if}
		<a
			href="/modell/{car.slug}"
			class="rounded-card bg-gray-900 px-3 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-gray-700"
		>
			Details →
		</a>
	</div>
</div>
