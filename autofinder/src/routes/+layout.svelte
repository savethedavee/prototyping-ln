<script lang="ts">
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';

	let { children } = $props();
</script>

<Nav />
<main class="min-h-[calc(100vh-4rem)] bg-gray-50">
	{@render children()}
</main>
