<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Datenschutz – AutoFinder</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-12">
	<h1 class="text-2xl font-medium text-gray-900">Datenschutzerklärung</h1>
	<p class="mt-2 text-sm text-gray-400">Stand: Juni 2026</p>

	<div class="mt-8 space-y-8 text-sm leading-relaxed text-gray-700">
		<section>
			<h2 class="text-base font-semibold text-gray-900">1. Verantwortliche Stelle</h2>
			<p class="mt-2">
				Verantwortlich für die Datenbearbeitung im Rahmen dieses studentischen Prototyp-Projekts:<br />
				David Feer, E-Mail:
				<a href="mailto:feerdav1@students.zhaw.ch" class="text-primary hover:underline">feerdav1@students.zhaw.ch</a>
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">2. Grundsatz</h2>
			<p class="mt-2">
				Es werden nur so wenige personenbezogene Daten wie möglich bearbeitet. Daten werden
				ausschliesslich zur Bereitstellung der Funktionen dieser Anwendung verwendet, nicht zu
				Werbezwecken verkauft oder vermietet und nicht für Tracking oder Profiling eingesetzt.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">3. Welche Daten wir bearbeiten</h2>
			<ul class="mt-2 list-disc space-y-2 pl-5">
				<li>
					<strong>Anmeldedaten (Login mit Google):</strong> Bei der Anmeldung über Google erhalten
					wir Name, E-Mail-Adresse, Profilbild sowie eine eindeutige Google-Konto-Kennung. Diese
					dienen der Identifikation deines Kontos.
				</li>
				<li>
					<strong>Gespeicherte Suchen:</strong> Wenn du eine Suche speicherst, werden deine
					Sucheingaben (Budget, Nutzung, Antrieb, Marken usw.) zusammen mit deiner Konto-Kennung in
					der Datenbank abgelegt, damit du sie später wiederfindest.
				</li>
				<li>
					<strong>Technische Daten:</strong> Zur Aufrechterhaltung der Sitzung werden technisch
					notwendige Cookies gesetzt (siehe Punkt 5). Sucheingaben werden zudem temporär lokal in
					deinem Browser (<code>sessionStorage</code>) gehalten.
				</li>
			</ul>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">4. Zwecke & Rechtsgrundlagen</h2>
			<p class="mt-2">
				Die Bearbeitung erfolgt zur Bereitstellung des Dienstes (Anmeldung, Anzeige von
				Empfehlungen, Speichern von Suchen). Rechtsgrundlage ist deine Einwilligung bzw. die zur
				Nutzung erforderliche Vertragserfüllung gemäss dem schweizerischen Datenschutzgesetz (revDSG)
				und – soweit anwendbar – der EU-Datenschutz-Grundverordnung (DSGVO).
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">5. Cookies & lokale Speicherung</h2>
			<p class="mt-2">
				Es werden ausschliesslich <strong>technisch notwendige</strong> Cookies verwendet
				(Sitzungs-Cookie für den Login sowie ein Sicherheits-Token gegen Cross-Site-Request-Forgery).
				Es kommen keine Marketing-, Analyse- oder Tracking-Cookies zum Einsatz. Daher ist kein
				Cookie-Einwilligungsbanner erforderlich. Du kannst dich jederzeit abmelden, wodurch das
				Sitzungs-Cookie entfernt wird.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">6. Dienste von Dritten</h2>
			<p class="mt-2">
				Zur Bereitstellung der Anwendung werden folgende Dienstleister eingesetzt, an die dabei
				zwangsläufig bestimmte Daten übermittelt werden können:
			</p>
			<ul class="mt-2 list-disc space-y-2 pl-5">
				<li>
					<strong>Google (Anmeldung / OAuth):</strong> für die Authentifizierung. Es gelten die
					<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Datenschutzbestimmungen von Google</a>.
				</li>
				<li>
					<strong>Netlify (Hosting):</strong> Auslieferung der Anwendung; dabei werden technisch
					bedingt Verbindungsdaten (z. B. IP-Adresse) verarbeitet. Serverstandort u. U. ausserhalb
					der Schweiz/EU.
				</li>
				<li>
					<strong>MongoDB Atlas (Datenbank):</strong> Speicherung der Konto-Kennung und gespeicherten
					Suchen.
				</li>
			</ul>
			<p class="mt-2">
				Fahrzeugdaten werden aus öffentlich zugänglichen Drittquellen bezogen und dienen nur der
				Information; hierbei werden keine personenbezogenen Daten von dir an diese Quellen übermittelt.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">7. Speicherdauer</h2>
			<p class="mt-2">
				Gespeicherte Suchen bleiben erhalten, bis du sie löschst. Du kannst gespeicherte Suchen
				jederzeit unter „Meine Suchen" entfernen. Auf Anfrage werden alle zu deinem Konto
				gespeicherten Daten gelöscht.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">8. Deine Rechte</h2>
			<p class="mt-2">
				Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Bearbeitung
				deiner Daten sowie das Recht, eine erteilte Einwilligung jederzeit zu widerrufen. Wende dich
				dazu an die oben genannte Kontaktadresse.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">9. Datensicherheit</h2>
			<p class="mt-2">
				Es werden angemessene technische und organisatorische Massnahmen getroffen, um deine Daten zu
				schützen. Bei der Übertragung über das Internet kann jedoch keine vollständige Sicherheit
				garantiert werden. Da es sich um ein Lern-/Prototyp-Projekt handelt, wird empfohlen, keine
				sensiblen Daten zu hinterlegen.
			</p>
		</section>

		<section>
			<h2 class="text-base font-semibold text-gray-900">10. Änderungen</h2>
			<p class="mt-2">
				Diese Datenschutzerklärung kann jederzeit angepasst werden. Es gilt jeweils die hier
				veröffentlichte Fassung.
			</p>
		</section>
	</div>

	<a href="/" class="mt-10 inline-block text-sm text-gray-400 hover:text-gray-600">← Zurück zur Startseite</a>
</div>

<Footer />
