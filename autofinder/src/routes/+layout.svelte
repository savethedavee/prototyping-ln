<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import { page } from '$app/state';

	let { data, children } = $props();

	let isWizard = $derived(
		page.url.pathname.startsWith('/finder') || page.url.pathname === '/berechnung'
	);
	let isLogin = $derived(page.url.pathname === '/login');
</script>

{#if !isWizard}
	<Nav user={data.user} minimal={isLogin} />
{/if}
<div class={isWizard ? '' : 'flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50'}>
	{@render children()}
</div>
