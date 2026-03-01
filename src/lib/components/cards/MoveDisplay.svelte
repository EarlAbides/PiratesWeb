<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		move: string;
	}

	const { move }: Props = $props();

	// 'S+L' → ['S', 'L'], 'S' → ['S']
	const parts = $derived(move.split('+'));
</script>

<div class="inline-flex items-end gap-1 rounded bg-black px-2 py-1">
	<img src="{base}/images/icons/move.png" alt="" aria-hidden="true" height="22" width="62" class="shrink-0" />
	{#each parts as part, i}
		{#if i > 0}
			<span class="leading-none text-white" style="font-family:'Cinzel',serif;font-weight:700;font-size:26px">+</span>
		{/if}
		<span
			class="leading-none"
			style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;color:{part === 'L' ? '#cc2020' : '#ffffff'}"
		>{part}</span>
	{/each}
</div>
