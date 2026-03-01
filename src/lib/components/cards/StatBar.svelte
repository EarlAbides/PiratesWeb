<script lang="ts">
	import type { Card } from '$lib/types/cardTypes';
	import MastIcon from '$lib/components/icons/stat/MastIcon.svelte';
	import CargoIcon from '$lib/components/icons/stat/CargoIcon.svelte';
	import MoveIcon from '$lib/components/icons/stat/MoveIcon.svelte';
	import CannonDisplay from './CannonDisplay.svelte';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();
</script>

{#if card.type === 'Ship'}
	<div class="flex items-center gap-2 flex-wrap text-xs">
		<span class="inline-flex items-center gap-0.5">
			<span class="w-4 h-4 shrink-0"><MastIcon /></span>
			{card.details.masts}
		</span>
		<span class="inline-flex items-center gap-0.5">
			<span class="w-4 h-4 shrink-0"><CargoIcon /></span>
			{card.details.cargo}
		</span>
		<span class="inline-flex items-center gap-0.5">
			<span class="w-4 h-4 shrink-0"><MoveIcon /></span>
			{card.details.baseMove}
		</span>
		<CannonDisplay cannons={card.details.cannons} />
	</div>
{:else if card.type === 'Fort'}
	<CannonDisplay cannons={card.details.cannons} />
{/if}
<!-- Crew, Treasure, Event: no stat bar rendered -->
