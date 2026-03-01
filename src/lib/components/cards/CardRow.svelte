<script lang="ts">
	import type { Card } from '$lib/types/cardTypes';
	import { thumbUrl } from '$lib/utils/cardUtils';
	import { SET_CLASS } from '$lib/utils/setUtils';
	import PointBadge from './PointBadge.svelte';
	import NationalityFlag from './NationalityFlag.svelte';
	import TypeBadge from './TypeBadge.svelte';
	import StatBar from './StatBar.svelte';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();

	const setBgClass = $derived(SET_CLASS[card.cardSet] ?? '');

	let thumbError = $state(false);
</script>

<div class="flex items-center gap-3 px-3 py-2 min-h-[60px] {setBgClass}">
	<PointBadge points={card.pointValue} />

	{#if thumbError}
		<div class="w-12 h-9 shrink-0 rounded-sm bg-black/30 flex items-center justify-center">
			<span class="text-xs opacity-40">?</span>
		</div>
	{:else}
		<img
			src={thumbUrl(card)}
			alt={card.name}
			loading="lazy"
			width="48"
			height="36"
			class="w-12 h-9 object-cover shrink-0 rounded-sm"
			onerror={() => {
				thumbError = true;
			}}
		/>
	{/if}

	<NationalityFlag nationality={card.nationality} />

	<div class="flex flex-col min-w-0 flex-1">
		<span class="text-sm truncate" style:font-family="'Cinzel', serif" style:font-weight="700" style:font-variant="small-caps">{card.name}</span>
		<span class="text-xs opacity-80 truncate">{card.ability}</span>
	</div>

	<StatBar {card} />

	<TypeBadge type={card.type} />
</div>
