<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { clearSearchInputs } from '$lib/stores/questionnaire';

	type NavUser = { name?: string | null; email?: string | null; image?: string | null };
	let { user = null, minimal = false }: { user?: NavUser | null; minimal?: boolean } = $props();

	function startNewSearch() {
		clearSearchInputs();
		goto('/finder/budget');
	}
</script>

<nav class="sticky top-0 z-30 border-b border-gray-200 bg-white">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex h-16 items-center justify-between">
			<a href="/" class="text-xl font-bold tracking-tight text-gray-900">
				Auto<span class="text-primary">Finder</span>
			</a>

			{#if !minimal}
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
						<button
							type="button"
							onclick={startNewSearch}
							class="rounded-card bg-gray-900 px-4 py-2 text-white transition-colors hover:bg-gray-700"
						>
							Auto finden
						</button>
					</li>
					<li class="flex items-center gap-3 border-l border-gray-200 pl-6">
						{#if user}
							{#if user.image}
								<img src={user.image} alt="" class="h-7 w-7 rounded-full" referrerpolicy="no-referrer" />
							{/if}
							<span class="hidden text-gray-600 sm:inline">{user.name ?? user.email}</span>
							<button
								type="button"
								onclick={() => signOut()}
								class="text-gray-500 transition-colors hover:text-primary"
							>
								Logout
							</button>
						{:else}
							<button
								type="button"
								onclick={() => signIn('google')}
								class="rounded-card border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:border-gray-400"
							>
								Login mit Google
							</button>
						{/if}
					</li>
				</ul>
			{/if}
		</div>
	</div>
</nav>
