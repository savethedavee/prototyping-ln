<svelte:head>
	<title>Meine Suchen – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-medium text-gray-900">Meine Suchen</h1>
			<p class="mt-1 text-sm text-gray-500">0 gespeicherte Such-Profile</p>
		</div>
		<a
			href="/finder/budget"
			class="rounded-card bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
		>
			+ Neue Suche
		</a>
	</div>

	<div class="mt-10 rounded-card border border-dashed border-gray-300 bg-white p-12 text-center">
		<p class="text-gray-400">Noch keine gespeicherten Suchen.</p>
		<p class="mt-1 text-sm text-gray-400">
			Starte eine Suche und speichere sie, um sie hier wiederzufinden.
		</p>
		<a
			href="/finder/budget"
			class="mt-6 inline-block rounded-card bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
		>
			Suche starten →
		</a>
	</div>
</div>
