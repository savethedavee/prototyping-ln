<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Impressum – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<h1 class="text-2xl font-medium text-gray-900">Impressum</h1>
	<p class="mt-2 text-sm text-gray-400">Stand: Juni 2026</p>

	<div class="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
		<section>
			<h2 class="text-base font-semibold text-gray-900">Betreiber & Verantwortlicher</h2>
			<p class="mt-2">
				David Feer<br />
				E-Mail: <a href="mailto:feerdav1@students.zhaw.ch" class="text-primary hover:underline">feerdav1@students.zhaw.ch</a>
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Art des Angebots</h2>
			<p class="mt-2">
				AutoFinder ist ein <strong>nicht-kommerzielles, studentisches Prototyp-Projekt</strong>,
				das im Rahmen eines Hochschulmoduls zu Ausbildungs- und Demonstrationszwecken entstanden
				ist. Es handelt sich um keinen kommerziellen Dienst, es werden keine Produkte verkauft und
				keine Vermittlungs- oder Beratungsleistungen erbracht.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Haftungsausschluss für Inhalte</h2>
			<p class="mt-2">
				Die auf AutoFinder dargestellten Fahrzeugdaten (Preise, Ausstattung, Verbrauch, Bilder,
				Händler- und Standortangaben usw.) werden automatisiert aus öffentlich zugänglichen
				Drittquellen, insbesondere von Online-Fahrzeugmarktplätzen, übernommen. Sie können
				<strong>unvollständig, veraltet oder fehlerhaft</strong> sein. Es wird keinerlei Gewähr für
				Richtigkeit, Aktualität, Vollständigkeit oder Verfügbarkeit der Angebote übernommen.
			</p>
			<p class="mt-2">
				Sämtliche Inhalte dienen ausschliesslich der unverbindlichen Information. Verbindlich sind
				allein die Angaben auf der jeweiligen Original-Plattform bzw. beim jeweiligen Anbieter.
				Eine Haftung für Schäden, die aus der Nutzung oder Nicht-Verfügbarkeit der bereitgestellten
				Informationen oder aus Entscheidungen auf deren Grundlage entstehen, wird – soweit gesetzlich
				zulässig – ausgeschlossen.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Keine Kauf-, Finanz- oder Rechtsberatung</h2>
			<p class="mt-2">
				Die angezeigten „Match"-Bewertungen und Empfehlungen sind rein algorithmisch erzeugte,
				unverbindliche Vorschläge. Sie stellen keine Kauf-, Finanz-, Versicherungs- oder
				Rechtsberatung dar und ersetzen keine eigene Prüfung oder fachkundige Beratung.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Haftung für externe Links</h2>
			<p class="mt-2">
				Diese Anwendung enthält Links zu externen Websites Dritter (z. B. zu Inseraten auf
				Fahrzeugmarktplätzen). Auf deren Inhalte besteht kein Einfluss; für diese fremden Inhalte
				wird keine Haftung übernommen. Für den Inhalt verlinkter Seiten ist stets der jeweilige
				Anbieter oder Betreiber verantwortlich.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Urheberrecht, Marken & Bilder</h2>
			<p class="mt-2">
				Fahrzeugbilder, Marken-, Modell- und Firmennamen sowie Logos sind Eigentum der jeweiligen
				Rechteinhaber (Hersteller, Händler bzw. der ursprünglichen Plattform). Sie werden hier
				lediglich zu Informations- und Demonstrationszwecken im Rahmen eines Bildungsprojekts
				dargestellt. Es wird damit keine Verbindung zu oder Befürwortung durch die jeweiligen
				Rechteinhaber suggeriert.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">Meldung von Rechtsverletzungen</h2>
			<p class="mt-2">
				Sollten durch dargestellte Inhalte Rechte Dritter (z. B. Urheber-, Marken- oder
				Datenschutzrechte) verletzt werden, wird um einen kurzen Hinweis per E-Mail gebeten. Die
				beanstandeten Inhalte werden umgehend geprüft und bei berechtigter Beanstandung entfernt.
			</p>
		</section>
	</div>

	<a href="/" class="mt-10 inline-block text-sm text-gray-400 hover:text-gray-600">← Zurück zur Startseite</a>
</div>

<Footer />
