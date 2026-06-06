<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { clearSearchInputs } from '$lib/stores/questionnaire';
	import { theme, toggleTheme } from '$lib/stores/theme';

	type NavUser = { name?: string | null; email?: string | null; image?: string | null };
	let { user = null, minimal = false }: { user?: NavUser | null; minimal?: boolean } = $props();

	let accountOpen = $state(false);

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
					<li class="relative flex items-center border-l border-gray-200 pl-6">
						<button
							type="button"
							onclick={() => (accountOpen = !accountOpen)}
							class="flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
							aria-haspopup="true"
							aria-expanded={accountOpen}
						>
							{#if user?.image}
								<img src={user.image} alt="" class="h-7 w-7 rounded-full" referrerpolicy="no-referrer" />
							{:else}
								<span class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500">
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
								</span>
							{/if}
							{#if user}
								<span class="hidden max-w-[10rem] truncate sm:inline">{user.name ?? user.email}</span>
							{/if}
							<svg class="h-4 w-4 text-gray-400 transition-transform" class:rotate-180={accountOpen} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						{#if accountOpen}
							<!-- Klick ausserhalb schliesst das Flyout -->
							<button
								type="button"
								class="fixed inset-0 z-40 cursor-default"
								aria-label="Menü schliessen"
								onclick={() => (accountOpen = false)}
							></button>

							<div
								class="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-card border border-gray-200 bg-white py-1 shadow-card"
							>
								{#if user}
									<div class="border-b border-gray-100 px-4 py-2">
										<p class="truncate text-sm font-medium text-gray-900">{user.name ?? 'Account'}</p>
										{#if user.email}
											<p class="truncate text-xs text-gray-400">{user.email}</p>
										{/if}
									</div>
								{/if}

								<button
									type="button"
									onclick={toggleTheme}
									class="flex w-full items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
								>
									<span class="flex items-center gap-2">
										{#if $theme === 'dark'}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
											</svg>
										{:else}
											<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
											</svg>
										{/if}
										Dark Mode
									</span>
									<span
										class="relative h-5 w-9 flex-shrink-0 rounded-full transition-colors"
										class:bg-primary={$theme === 'dark'}
										class:bg-gray-300={$theme !== 'dark'}
									>
										<span
											class="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform"
											class:translate-x-4={$theme === 'dark'}
										></span>
									</span>
								</button>

								<div class="my-1 border-t border-gray-100"></div>

								{#if user}
									<button
										type="button"
										onclick={() => signOut()}
										class="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
									>
										Logout
									</button>
								{:else}
									<button
										type="button"
										onclick={() => signIn('google')}
										class="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100"
									>
										Login mit Google
									</button>
								{/if}
							</div>
						{/if}
					</li>
				</ul>
			{/if}
		</div>
	</div>
</nav>
