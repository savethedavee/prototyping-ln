<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let isWizard = $derived(
		$page.url.pathname.startsWith('/finder') || $page.url.pathname === '/berechnung'
	);
</script>

{#if isWizard}
	{@render children()}
{:else}
	<Nav />
	<main class="min-h-[calc(100vh-4rem)] bg-gray-50">
		{@render children()}
	</main>
{/if}
