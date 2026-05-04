<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Modell-Detail – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<div class="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-widest text-gray-400">
			ID: {$page.params.id}
		</p>
		<h1 class="mt-2 text-2xl font-bold text-gray-900">Modell-Detail</h1>
		<p class="mt-3 text-gray-500">Wird in Schritt 2 mit Mock-Daten befüllt.</p>
		<a href="/results" class="mt-6 inline-block text-sm text-primary hover:underline">
			← Zurück zur Ergebnisliste
		</a>
	</div>
</div>
