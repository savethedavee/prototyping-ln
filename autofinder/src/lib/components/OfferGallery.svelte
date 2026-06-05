<script lang="ts">
	interface Props {
		images: string[];
		alt?: string;
	}
	let { images, alt = '' }: Props = $props();

	let track = $state<HTMLDivElement | undefined>();
	let index = $state(0);
	let failed = $state(new Set<string>());

	function go(i: number) {
		if (!track) return;
		const clamped = Math.max(0, Math.min(images.length - 1, i));
		track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
		index = clamped;
	}
	function onScroll() {
		if (!track) return;
		index = Math.round(track.scrollLeft / track.clientWidth);
	}
	function markFailed(src: string) {
		failed = new Set(failed).add(src);
	}
</script>

{#snippet placeholder()}
	<div class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
		<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z" />
		</svg>
	</div>
{/snippet}

<div class="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-gray-100">
	{#if images.length === 0}
		{@render placeholder()}
	{:else}
		<div
			bind:this={track}
			onscroll={onScroll}
			class="track flex h-full snap-x snap-mandatory overflow-x-auto"
		>
			{#each images as img}
				<div class="h-full w-full flex-shrink-0 snap-center">
					{#if !failed.has(img)}
						<img
							src={img}
							{alt}
							loading="lazy"
							draggable="false"
							class="h-full w-full object-cover"
							onerror={() => markFailed(img)}
						/>
					{:else}
						{@render placeholder()}
					{/if}
				</div>
			{/each}
		</div>

		{#if images.length > 1}
			<button
				type="button"
				aria-label="Vorheriges Bild"
				onclick={() => go(index - 1)}
				disabled={index === 0}
				class="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-gray-700 shadow transition hover:bg-white disabled:pointer-events-none disabled:opacity-0"
			>
				‹
			</button>
			<button
				type="button"
				aria-label="Nächstes Bild"
				onclick={() => go(index + 1)}
				disabled={index === images.length - 1}
				class="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-gray-700 shadow transition hover:bg-white disabled:pointer-events-none disabled:opacity-0"
			>
				›
			</button>

			<div class="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
				{#each images as _, i}
					<span
						class="h-1.5 w-1.5 rounded-full shadow transition-colors {i === index
							? 'bg-white'
							: 'bg-white/50'}"
					></span>
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.track {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.track::-webkit-scrollbar {
		display: none;
	}
</style>
