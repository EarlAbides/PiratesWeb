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
	<!-- Ship: flow layout — badge absolute over name+stats, stats follow name zone, ability box below -->
	<div class="relative border-b border-neutral-700 {setBgClass}">
		<!-- Badge: absolute, overlaps name zone and top of stats zone -->
		<div class="absolute" style="top: 4px; left: 4px; z-index: 2;">
			<PointBadge points={card.pointValue} />
		</div>

		<!-- Name zone: flag + name, padding-left clears badge; z-[3] keeps flag above badge -->
		<div
			class="relative flex items-center gap-2 pr-3 z-[3]"
			style="height: 40px; padding-left: 55px;"
		>
			<NationalityFlag nationality={card.nationality} />
			<span
				class="truncate"
				style="font-family:'Cinzel',serif;font-weight:700;font-variant:small-caps;font-size:24px;"
				>{card.name}</span
			>
		</div>

		<!-- Stats zone: masts pill extends under badge via padding-left: 59px -->
		<div class="flex items-end gap-0.5" style="padding-left: 10px;">
			<div class="inline-flex items-end gap-2 bg-black py-1" style="padding-left: 59px; padding-right: 8px;">
				<img src="{base}/images/icons/masts.png" alt="" aria-hidden="true" height="22" width="32" class="shrink-0 mb-0.5" />
				<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white;">{card.details.masts}</span>
			</div>
			<div class="inline-flex items-end gap-2 bg-black px-2 py-1">
				<img src="{base}/images/icons/cargo.png" alt="" aria-hidden="true" height="22" width="32" class="shrink-0 mb-0.5" />
				<span style="font-family:'Cinzel',serif;font-weight:700;font-size:26px;line-height:1;color:white;">{card.details.cargo}</span>
			</div>
			<MoveDisplay move={card.details.baseMove} />
			<CannonDisplay cannons={card.details.cannons} />
		</div>

		<!-- Ability box: below stats, left-aligned with badge, content height -->
		{#if card.ability}
			<div
				class="border-2 border-black px-2 py-1 mt-1 mb-1.5"
				style="margin-left: 4px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Treasure'}
	<!-- Treasure: circular thumbnail, no badge/flag, coin grid, ability box below -->
	<div class="flex flex-col border-b border-neutral-700 {setBgClass}">
		<div class="flex items-center min-h-[60px]">
			<!-- Circular thumbnail -->
			<div class="flex shrink-0 items-center p-1">
				{#if thumbError}
					<div class="flex h-[59px] w-[59px] shrink-0 items-center justify-center rounded-full bg-black/30 border border-black">
						<span class="text-xs opacity-40">?</span>
					</div>
				{:else}
					<img
						src={thumbUrl(card)}
						alt={card.name}
						loading="lazy"
						width="59"
						height="59"
						class="h-[59px] w-[59px] shrink-0 rounded-full object-cover border border-black"
						onerror={() => { thumbError = true; }}
					/>
				{/if}
			</div>
			<!-- Name + coin grid -->
			<div class="flex min-w-0 flex-1 items-center py-1 px-1">
				<span class="truncate font-semibold" style="font-family: 'Cinzel', serif; font-size: 22px; font-variant: small-caps;">{card.name}</span>
				<div class="grid grid-cols-3 gap-[2px] shrink-0 ml-[10px]">
					{#each card.details.treasureValues as val}
						<div class="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black">
							<span style="font-family: 'Cinzel', serif; font-size: 9px; font-weight: 700; color: #d4a017; line-height: 1;">{val}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- Ability box -->
		{#if card.ability}
			<div
				class="border-2 border-black px-2 py-1 mb-1.5"
				style="margin-left: 4px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Event'}
	<!-- Event: PointBadge + 59×59 thumbnail + name, ability box below -->
	<div class="flex flex-col border-b border-neutral-700 {setBgClass}">
		<div class="flex items-center min-h-[60px]">
			<div class="flex w-[59px] shrink-0 items-center justify-center px-1">
				<PointBadge points={card.pointValue} />
			</div>
			<div class="flex shrink-0 items-center pl-[2px]">
				{#if thumbError}
					<div class="flex h-[59px] w-[59px] shrink-0 items-center justify-center rounded-sm bg-black/30 border-2 border-black">
						<span class="text-xs opacity-40">?</span>
					</div>
				{:else}
					<img
						src={thumbUrl(card)}
						alt={card.name}
						loading="lazy"
						width="59"
						height="59"
						class="h-[59px] w-[59px] shrink-0 rounded-sm object-cover border-2 border-black"
						onerror={() => { thumbError = true; }}
					/>
				{/if}
			</div>
			<div class="flex min-w-0 flex-1 items-center py-1 px-2">
				<span
					class="truncate font-semibold"
					style="font-family: 'Cinzel', serif; font-size: 22px; font-variant: small-caps;"
				>{card.name}</span>
			</div>
		</div>
		{#if card.ability}
			<div
				class="border-2 border-black px-2 py-1 mb-1.5"
				style="margin-left: 4px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else}
	<!-- Non-ship cards: flat layout (unchanged) -->
	<div class="flex min-h-[60px] items-center gap-3 border-b border-neutral-700 px-3 py-2 {setBgClass}">
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
