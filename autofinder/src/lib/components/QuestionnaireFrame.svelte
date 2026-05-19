<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		currentStep: number;
		optional?: boolean;
		children: Snippet;
		backHref?: string;
		nextHref?: string;
		nextLabel?: string;
		skipHref?: string;
		canNext?: boolean;
	}

	let {
		currentStep,
		optional = false,
		children,
		backHref,
		nextHref,
		nextLabel = 'Weiter →',
		skipHref,
		canNext = true
	}: Props = $props();

	const TOTAL = 6;
	const progress = $derived((currentStep / TOTAL) * 100);
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<!-- Mini-Nav -->
	<header class="border-b border-gray-200 bg-white">
		<div class="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
			<a href="/" class="text-xl font-bold tracking-tight text-gray-900">
				Auto<span class="text-primary">Finder</span>
			</a>
			<a href="/" class="text-sm text-gray-400 transition-colors hover:text-gray-700">
				Abbrechen ✕
			</a>
		</div>
	</header>

	<!-- Progress Bar -->
	<div class="border-b border-gray-100 bg-white">
		<div class="mx-auto max-w-3xl px-4 py-3">
			<div class="mb-2 flex items-center justify-between">
				<span class="text-sm text-gray-700">
					Schritt {currentStep} von {TOTAL}
					{#if optional}
						<span class="ml-1 font-normal text-gray-400">· optional</span>
					{/if}
				</span>
				<span class="text-sm text-gray-400">{Math.round(progress)} %</span>
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
				<div
					class="h-1.5 rounded-full bg-primary transition-all duration-500"
					style="width: {progress}%"
				></div>
			</div>
		</div>
	</div>

	<!-- Content -->
	<main class="flex-1 py-12">
		<div class="mx-auto max-w-3xl px-4">
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-200 bg-white">
		<div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
			{#if backHref}
				<a href={backHref} class="text-sm text-gray-500 transition-colors hover:text-gray-900">
					← Zurück
				</a>
			{:else}
				<span class="text-sm text-gray-300">← Zurück</span>
			{/if}

			<div class="flex items-center gap-4">
				{#if skipHref}
					<a href={skipHref} class="text-sm text-gray-400 underline hover:text-gray-600">
						Überspringen
					</a>
				{/if}
				{#if nextHref}
					<a
						href={canNext ? nextHref : undefined}
						class="rounded-card px-6 py-2.5 text-sm font-medium text-white transition-colors"
						class:bg-gray-900={canNext}
						class:hover:bg-gray-700={canNext}
						class:bg-gray-300={!canNext}
						class:pointer-events-none={!canNext}
					>
						{nextLabel}
					</a>
				{/if}
			</div>
		</div>
	</footer>
</div>
