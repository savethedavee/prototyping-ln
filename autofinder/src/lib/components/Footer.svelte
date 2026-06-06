<script lang="ts">
	type Link = { label: string; href: string };
	let {
		links = [
			{ label: 'Datenschutz', href: '/datenschutz' },
			{ label: 'Impressum', href: '/impressum' }
		]
	}: { links?: Link[] } = $props();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-gray-200 bg-white px-4 py-5">
	<div class="mx-auto flex max-w-6xl items-center justify-between text-xs text-gray-400">
		<span>© {year} AutoFinder</span>
		{#if links.length}
			<div class="flex items-center gap-4">
				{#each links as l}
					<a href={l.href} class="transition-colors hover:text-gray-600">{l.label}</a>
				{/each}
			</div>
		{/if}
	</div>
</footer>
