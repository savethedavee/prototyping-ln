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
					<a href="/#how-it-works" class="text-gray-600 transition-colors hover:text-primary">
						So funktioniert's
					</a>
				</li>
				<li>
					<a
						href="/saved-searches"
						class="transition-colors hover:text-primary"
						class:text-primary={$page.url.pathname.startsWith('/saved-searches')}
						class:text-gray-600={!$page.url.pathname.startsWith('/saved-searches')}
					>
						Meine Suchen
					</a>
				</li>
				<li>
					<a
						href="/questionnaire"
						class="rounded-card bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark"
					>
						Auto finden
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
