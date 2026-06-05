<script lang="ts">
	let { links = ['Datenschutz', 'Impressum'] }: { links?: string[] } = $props();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-gray-200 bg-white px-4 py-5">
	<div class="mx-auto flex max-w-6xl items-center justify-between text-xs text-gray-400">
		<span>© {year} AutoFinder</span>
		{#if links.length}
			<span>{links.join(' · ')}</span>
		{/if}
	</div>
</footer>
