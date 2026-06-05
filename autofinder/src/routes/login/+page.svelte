<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import Footer from '$lib/components/Footer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Anmelden – AutoFinder</title>
</svelte:head>

<div class="dots flex flex-1 items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm rounded-card border border-gray-200 bg-white p-8 text-center shadow-card">
		<!-- Icon (visuelle Auflockerung, kein Text) -->
		<div
			class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-light text-primary"
		>
			<svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 6h2l3 5v5h-5V6z" />
			</svg>
		</div>

		<h1 class="mt-5 text-xl font-medium text-gray-900">Willkommen bei AutoFinder</h1>
		<p class="mt-2 text-sm text-gray-500">
			Melde dich an, um deine Suchen zu speichern und Empfehlungen zu erhalten.
		</p>

		<button
			type="button"
			onclick={() => signIn('google', { callbackUrl: data.callbackUrl })}
			class="mt-6 flex w-full items-center justify-center gap-3 rounded-card border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.1a6.6 6.6 0 0 1 0-4.22V7.04H2.18a11 11 0 0 0 0 9.92l3.66-2.86z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
				/>
			</svg>
			Mit Google anmelden
		</button>

		<a href="/" class="mt-4 block text-sm text-gray-400 hover:text-gray-600">
			Zurück zur Startseite
		</a>
	</div>
</div>

<Footer />

<style>
	/* Dezentes Punkt-Raster als Hintergrund (gray-50 + gray-200 Punkte) */
	.dots {
		background-color: #f9fafb;
		background-image: radial-gradient(#e5e7eb 1.3px, transparent 1.3px);
		background-size: 22px 22px;
	}
</style>
