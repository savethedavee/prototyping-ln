<svelte:head>
	<title>AutoFinder – Das passende Auto finden</title>
	<meta name="description" content="Finde dein passendes Auto in wenigen Minuten." />
</svelte:head>

<div class="flex flex-1 flex-col">
	<!-- Hero -->
	<section class="flex flex-1 items-center justify-center bg-white px-4 py-12 text-center">
		<div class="mx-auto max-w-2xl">
			<p class="text-xs font-semibold uppercase tracking-widest text-primary">
				Dein persönlicher Autoberater
			</p>
			<h1 class="mt-3 text-4xl font-medium leading-tight tracking-tight text-gray-900 md:text-5xl">
				Das richtige Auto<br />ohne Vorwissen finden
			</h1>
			<p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
				Beantworte 6 kurze Fragen zu Budget, Nutzung und Prioritäten — wir zeigen dir die Modelle,
				die am besten zu dir passen.
			</p>
			<a
				href="/finder/budget"
				class="mt-6 inline-block rounded-card bg-gray-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gray-700"
			>
				Auto finden →
			</a>
			<p class="mt-3 text-xs text-gray-400">ca. 3 Minuten · Kostenlos · Keine Anmeldung nötig</p>
		</div>
	</section>

	<!-- 3-Schritt-Erklärung -->
	<section class="border-t border-gray-100 bg-gray-50 px-4 py-10">
		<div class="mx-auto max-w-4xl">
			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="text-center">
					<div
						class="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white"
					>
						1
					</div>
					<h3 class="mb-1 font-medium text-gray-900">Bedürfnisse erfassen</h3>
					<p class="text-sm leading-relaxed text-gray-500">
						Budget, Nutzung, Antrieb und Ausstattung — 6 kurze Schritte, kein Fachjargon.
					</p>
				</div>
				<div class="text-center">
					<div
						class="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white"
					>
						2
					</div>
					<h3 class="mb-1 font-medium text-gray-900">Modelle vergleichen</h3>
					<p class="text-sm leading-relaxed text-gray-500">
						Passende Modelle mit Match-Score in % — sortiert nach Übereinstimmung.
					</p>
				</div>
				<div class="text-center">
					<div
						class="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white"
					>
						3
					</div>
					<h3 class="mb-1 font-medium text-gray-900">Angebote einsehen</h3>
					<p class="text-sm leading-relaxed text-gray-500">
						Bis zu 3 Modelle nebeneinander vergleichen und direkt zum Anbieter wechseln.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-gray-200 bg-white px-4 py-5">
		<div class="mx-auto flex max-w-6xl items-center justify-between text-xs text-gray-400">
			<span>© 2026 AutoFinder</span>
			<span>Datenschutz · Impressum</span>
		</div>
	</footer>
</div>
