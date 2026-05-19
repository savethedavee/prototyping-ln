<svelte:head>
	<title>So funktioniert's – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-20 text-center">
	<p class="text-xs font-semibold uppercase tracking-widest text-primary">In 3 Minuten zum Ziel</p>
	<h1 class="mt-4 text-3xl font-medium text-gray-900">In 3 Minuten zum passenden Auto</h1>
	<p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
		Kein Fachjargon, keine stundenlange Recherche — einfach deine Bedürfnisse angeben und wir
		zeigen dir die besten Optionen.
	</p>

	<div class="mt-14 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
		<div>
			<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">1</div>
			<h3 class="font-medium text-gray-900">Fragebogen ausfüllen</h3>
			<p class="mt-2 text-sm leading-relaxed text-gray-500">
				6 kurze Fragen zu Budget, Nutzung, Antrieb, Marken, Ausstattung und Prioritäten.
				Dauert ca. 2–3 Minuten.
			</p>
		</div>
		<div>
			<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">2</div>
			<h3 class="font-medium text-gray-900">Empfehlungen ansehen</h3>
			<p class="mt-2 text-sm leading-relaxed text-gray-500">
				Passende Modelle werden mit einem Match-Score (%) bewertet — je höher, desto besser
				passen sie zu dir.
			</p>
		</div>
		<div>
			<div class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">3</div>
			<h3 class="font-medium text-gray-900">Vergleichen & entscheiden</h3>
			<p class="mt-2 text-sm leading-relaxed text-gray-500">
				Bis zu 3 Modelle nebeneinander vergleichen und direkt beim Anbieter ein Angebot einholen.
			</p>
		</div>
	</div>

	<a
		href="/finder/budget"
		class="mt-14 inline-block rounded-card bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700"
	>
		Jetzt starten →
	</a>
</div>

<footer class="border-t border-gray-200 bg-white px-4 py-6">
	<div class="mx-auto flex max-w-6xl items-center justify-between text-xs text-gray-400">
		<span>© 2026 AutoFinder</span>
		<span>Datenschutz · Impressum</span>
	</div>
</footer>
