<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Suche bearbeiten – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12">
	<div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
			ID: {$page.params.id}
		</p>
		<h1 class="mt-2 text-2xl font-bold text-gray-900">Suche bearbeiten</h1>
		<p class="mt-3 text-gray-500">Wird in Schritt 4 implementiert.</p>
		<a href="/saved-searches" class="mt-6 inline-block text-sm text-primary hover:underline">
			← Zu Meine Suchen
		</a>
	</div>
</div>
