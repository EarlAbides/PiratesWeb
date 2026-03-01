<script lang="ts">
	import { base } from '$app/paths';
	import type { Card } from '$lib/types/cardTypes';
	import MoveDisplay from './MoveDisplay.svelte';
	import CannonDisplay from './CannonDisplay.svelte';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();
</script>

{#if card.type === 'Ship'}
	<div class="inline-flex items-stretch gap-0.5">
		<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
			<img src="{base}/images/icons/masts.png" alt="" aria-hidden="true" height="22" width="32" class="shrink-0 mb-0.5" />
			<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{card.details.masts}</span>
		</div>
		<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
			<img src="{base}/images/icons/cargo.png" alt="" aria-hidden="true" height="22" width="32" class="shrink-0 mb-0.5" />
			<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white">{card.details.cargo}</span>
		</div>
		<MoveDisplay move={card.details.baseMove} />
		<CannonDisplay cannons={card.details.cannons} />
	</div>
{:else if card.type === 'Fort'}
	<CannonDisplay cannons={card.details.cannons} />
{/if}
<!-- Crew, Treasure, Event: no stat bar rendered -->
