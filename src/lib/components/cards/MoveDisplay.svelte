<script lang="ts">
	import { base } from '$app/paths';

	interface Props {
		move: string;
	}

	const { move }: Props = $props();

	// 'S+L' → ['S', 'L'], 'S' → ['S']
	const parts = $derived(move.split('+'));
</script>

<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
	<img src="{base}/images/icons/move.png" alt="" aria-hidden="true" height="22" width="62" class="shrink-0 mb-0.5" />
	<span class="inline-flex items-end">
		{#each parts as part, i}
			{#if i > 0}
				<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">+</span>
			{/if}
			<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:{part === 'L' ? '#cc2020' : '#ffffff'}">{part}</span>
		{/each}
	</span>
</div>
