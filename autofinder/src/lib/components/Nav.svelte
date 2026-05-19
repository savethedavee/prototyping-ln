<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="border-b border-gray-200 bg-white">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight text-gray-900">
				Auto<span class="text-primary">Finder</span>
			</a>

			<ul class="flex items-center gap-6 text-sm font-medium">
				<li>
					<a
						href="/"
						class="transition-colors hover:text-primary"
						class:text-primary={$page.url.pathname === '/'}
						class:text-gray-600={$page.url.pathname !== '/'}
					>
						Start
					</a>
				</li>
				<li>
					<a
						href="/so-funktionierts"
						class="transition-colors hover:text-primary"
						class:text-primary={$page.url.pathname === '/so-funktionierts'}
						class:text-gray-600={$page.url.pathname !== '/so-funktionierts'}
					>
						So funktioniert's
					</a>
				</li>
				<li>
					<a
						href="/meine-suchen"
						class="transition-colors hover:text-primary"
						class:text-primary={$page.url.pathname.startsWith('/meine-suchen')}
						class:text-gray-600={!$page.url.pathname.startsWith('/meine-suchen')}
					>
						Meine Suchen
					</a>
				</li>
				<li>
					<a
						href="/finder/budget"
						class="rounded-card bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-700"
					>
						Auto finden
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
