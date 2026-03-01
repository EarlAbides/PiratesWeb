<script lang="ts">
	import { base } from '$app/paths';
	import type { Card } from '$lib/types/cardTypes';
	import { thumbUrl } from '$lib/utils/cardUtils';
	import { SET_CLASS } from '$lib/utils/setUtils';
	import PointBadge from './PointBadge.svelte';
	import NationalityFlag from './NationalityFlag.svelte';
	import TypeBadge from './TypeBadge.svelte';
	import StatBar from './StatBar.svelte';
	import MoveDisplay from './MoveDisplay.svelte';
	import CannonDisplay from './CannonDisplay.svelte';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();

	const setBgClass = $derived(SET_CLASS[card.cardSet] ?? '');

	let thumbError = $state(false);
</script>

{#if card.type === 'Ship'}
	<!-- Ship: layered design — stats pills are back layer, badge overlays top-left, flag+name in upper zone -->
	<div class="relative overflow-hidden border-b border-black {setBgClass}" style="min-height: 80px;">
		<!-- Layer 1: Stats pills — masts pill extends under badge (left: 10px), content clears badge via padding-left: 59px -->
		<div
			class="absolute inline-flex items-stretch gap-0.5"
			style="bottom: 6px; left: 10px; z-index: 1;"
		>
			<div
				class="inline-flex items-end gap-2 bg-black py-1"
				style="padding-left: 59px; padding-right: 8px;"
			>
				<img
					src="{base}/images/icons/masts.png"
					alt=""
					aria-hidden="true"
					height="22"
					width="32"
					class="shrink-0 mb-0.5"
				/>
				<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white;"
					>{card.details.masts}</span
				>
			</div>
			<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
				<img
					src="{base}/images/icons/cargo.png"
					alt=""
					aria-hidden="true"
					height="22"
					width="32"
					class="shrink-0 mb-0.5"
				/>
				<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white;"
					>{card.details.cargo}</span
				>
			</div>
			<MoveDisplay move={card.details.baseMove} />
			<CannonDisplay cannons={card.details.cannons} />
		</div>

		<!-- Layer 2: Points badge — 59×59, inset 4px from corner -->
		<div class="absolute" style="top: 4px; left: 4px; z-index: 2;">
			<PointBadge points={card.pointValue} />
		</div>

		<!-- Layer 3: Flag + Name — upper zone, flag overlaps badge right edge by 8px -->
		<div
			class="absolute inset-x-0 top-0 flex items-center gap-2"
			style="height: 40px; padding-left: 55px; z-index: 3;"
		>
			<NationalityFlag nationality={card.nationality} />
			<span
				class="truncate"
				style="font-family:'Cinzel',serif;font-weight:700;font-variant:small-caps;font-size:24px;"
				>{card.name}</span
			>
		</div>
	</div>
{:else}
	<!-- Non-ship cards: flat layout (unchanged) -->
	<div class="flex min-h-[60px] items-center gap-3 border-b border-black px-3 py-2 {setBgClass}">
		<PointBadge points={card.pointValue} />

		{#if thumbError}
			<div class="flex h-9 w-12 shrink-0 items-center justify-center rounded-sm bg-black/30">
				<span class="text-xs opacity-40">?</span>
			</div>
		{:else}
			<img
				src={thumbUrl(card)}
				alt={card.name}
				loading="lazy"
				width="48"
				height="36"
				class="h-9 w-12 shrink-0 rounded-sm object-cover"
				onerror={() => {
					thumbError = true;
				}}
			/>
		{/if}

		<NationalityFlag nationality={card.nationality} />

		<div class="flex min-w-0 flex-1 flex-col">
			<span
				class="truncate text-sm"
				style:font-family="'Cinzel', serif"
				style:font-weight="700"
				style:font-variant="small-caps">{card.name}</span
			>
			<span class="truncate text-xs opacity-80">{card.ability}</span>
		</div>

		<StatBar {card} />

		<TypeBadge type={card.type} />
	</div>
{/if}
