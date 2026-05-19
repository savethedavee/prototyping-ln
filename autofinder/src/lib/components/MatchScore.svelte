<script lang="ts">
	interface Props {
		score: number;
		size?: 'sm' | 'lg';
	}

	let { score, size = 'lg' }: Props = $props();

	let isGood = $derived(score >= 85);
</script>

<div class="text-right">
	<span
		class="font-medium tabular-nums"
		class:text-3xl={size === 'lg'}
		class:text-xl={size === 'sm'}
		class:text-success={isGood}
		class:text-gray-800={!isGood}
	>
		{score} %
	</span>
	<p
		class="text-gray-400"
		class:text-xs={size === 'lg'}
		class:text-[10px]={size === 'sm'}
	>
		MATCH
	</p>
</div>
