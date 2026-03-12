<script lang="ts">
	import { base } from '$app/paths';
	import type { Card } from '$lib/types/cardTypes';
	import { thumbUrl } from '$lib/utils/cardUtils';
	import { SET_CLASS } from '$lib/utils/setUtils';
	import PointBadge from './PointBadge.svelte';
	import NationalityFlag from './NationalityFlag.svelte';
	import GoldCostBadge from './GoldCostBadge.svelte';
	import MoveDisplay from './MoveDisplay.svelte';
	import CannonDisplay from './CannonDisplay.svelte';
	import CardCornerBadge from './CardCornerBadge.svelte';

	interface Props {
		card: Card;
		onclick?: () => void;
		isActive?: boolean;
	}

	const { card, onclick, isActive = false }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (onclick && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault();
			onclick();
		}
	}

	const setBgClass = $derived(SET_CLASS[card.cardSet] ?? '');

	// Scale name font size down for long names so they fit without truncation
	const nameFontSize = $derived(
		card.name.length > 29 ? '18px' : card.name.length > 22 ? '22px' : '26px'
	);

	let thumbError = $state(false);
</script>

{#if card.type === 'Ship'}
	<!-- Ship: flow layout — badge absolute over name+stats, stats follow name zone, ability box below -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex -->
	<div
		class="relative overflow-hidden rounded-xl shadow-sm {setBgClass}"
		style="width: 575px;"
		onclick={onclick}
		onkeydown={handleKeydown}
		role={onclick ? 'button' : undefined}
		tabindex={onclick ? 0 : undefined}
		aria-expanded={onclick ? isActive : undefined}
	>
		<CardCornerBadge cardNumber={card.cardNumber} rarity={card.rarity} />
		<!-- Badge: absolute, overlaps name zone and top of stats zone -->
		<div class="absolute" style="top: 8px; left: 8px; z-index: 2;">
			<PointBadge points={card.pointValue} />
		</div>

		<!-- Name zone: flag + name, padding-left clears badge; z-[3] keeps flag above badge -->
		<div
			class="relative flex items-center gap-2 pr-3 z-[3]"
			style="height: 40px; padding-left: 59px;"
		>
			<NationalityFlag nationality={card.nationality} />
			<span
				class="truncate"
				style="font-family:'Cinzel',serif;font-weight:700;font-variant:small-caps;font-size:{nameFontSize};"
				>{card.name}</span
			>
		</div>

		<!-- Stats zone: masts pill extends under badge via padding-left: 63px -->
		<div class="flex items-end gap-0.5" style="padding-left: 14px;">
			<div class="inline-flex items-end gap-2 bg-black py-1" style="padding-left: 63px; padding-right: 8px;">
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
				style="margin-left: 8px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Treasure'}
	<!-- Treasure: circular thumbnail, no badge/flag, coin grid, ability box below -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex -->
	<div
		class="relative overflow-hidden flex flex-col rounded-xl shadow-sm {setBgClass}"
		style="width: 575px;"
		onclick={onclick}
		onkeydown={handleKeydown}
		role={onclick ? 'button' : undefined}
		tabindex={onclick ? 0 : undefined}
		aria-expanded={onclick ? isActive : undefined}
	>
		<CardCornerBadge cardNumber={card.cardNumber} rarity={card.rarity} />
		<div class="flex items-center min-h-[60px]">
			<!-- Circular thumbnail -->
			<div class="flex shrink-0 items-center p-1.5">
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
				<span class="truncate font-semibold" style="font-family: 'Cinzel', serif; font-size: {nameFontSize}; font-variant: small-caps;">{card.name}</span>
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
				style="margin-left: 8px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Crew'}
	<!-- Crew: badge + thumbnail both absolute side by side; name zone floats off thumbnail right edge -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex -->
	<div
		class="relative overflow-hidden flex flex-col rounded-xl shadow-sm {setBgClass}"
		style="width: 575px; min-height: 67px;"
		onclick={onclick}
		onkeydown={handleKeydown}
		role={onclick ? 'button' : undefined}
		tabindex={onclick ? 0 : undefined}
		aria-expanded={onclick ? isActive : undefined}
	>
		<CardCornerBadge cardNumber={card.cardNumber} rarity={card.rarity} />
		<!-- Badge: absolute top-left -->
		<div class="absolute" style="top: 8px; left: 8px; z-index: 2;">
			<PointBadge points={card.pointValue} />
		</div>

		<!-- Thumbnail: absolute, 2px right of badge (left: 69px) -->
		<div class="absolute" style="top: 8px; left: 69px; z-index: 2;">
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

		<!-- Name zone: padding-left 120px = thumbnail right edge (128px) - 8px flag overlap -->
		<div
			class="relative flex items-center gap-2 pr-3 z-[3]"
			style="height: 40px; padding-left: 120px;"
		>
			<NationalityFlag nationality={card.nationality} />
			<span
				class="truncate"
				style="font-family:'Cinzel',serif;font-weight:700;font-variant:small-caps;font-size:{nameFontSize};"
			>{card.name}</span>
		</div>

		{#if card.ability}
			<!-- mt-[31px]: clears badge/thumbnail bottom (top:8+height:59=67px, minus name zone 40px = 27px) + 4px gap -->
			<div
				class="border-2 border-black px-2 py-1 mt-[31px] mb-1.5"
				style="margin-left: 8px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Fort'}
	<!-- Fort: layered design — GoldCostBadge absolute, flag + name zone, cannon zone extends behind badge, ability box below -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex -->
	<div
		class="relative overflow-hidden rounded-xl shadow-sm {setBgClass}"
		style="width: 575px;"
		onclick={onclick}
		onkeydown={handleKeydown}
		role={onclick ? 'button' : undefined}
		tabindex={onclick ? 0 : undefined}
		aria-expanded={onclick ? isActive : undefined}
	>
		<CardCornerBadge cardNumber={card.cardNumber} rarity={card.rarity} />
		<!-- GoldCostBadge: absolute, same position as ship's PointBadge -->
		<div class="absolute" style="top: 8px; left: 8px; z-index: 2;">
			<GoldCostBadge cost={card.details.goldCost} />
		</div>

		<!-- Name zone: flag + name, padding-left clears badge; z-[3] keeps flag above badge -->
		<div
			class="relative flex items-center gap-2 pr-3 z-[3]"
			style="height: 40px; padding-left: 59px;"
		>
			<NationalityFlag nationality={card.nationality} />
			<span
				class="truncate"
				style="font-family:'Cinzel',serif;font-weight:700;font-variant:small-caps;font-size:{nameFontSize};"
			>{card.name}</span>
		</div>

		<!-- Cannon zone: pill extends behind badge via paddingLeft prop -->
		<div class="flex items-end" style="padding-left: 14px;">
			<CannonDisplay cannons={card.details.cannons} paddingLeft="63px" />
		</div>

		<!-- Ability box: below cannon zone -->
		{#if card.ability}
			<div
				class="border-2 border-black px-2 py-1 mt-1 mb-1.5"
				style="margin-left: 8px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{:else if card.type === 'Event'}
	<!-- Event: PointBadge absolute (top/left 8px), thumbnail + name in content row -->
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_no_noninteractive_tabindex -->
	<div
		class="relative overflow-hidden flex flex-col rounded-xl shadow-sm {setBgClass}"
		style="width: 575px;"
		onclick={onclick}
		onkeydown={handleKeydown}
		role={onclick ? 'button' : undefined}
		tabindex={onclick ? 0 : undefined}
		aria-expanded={onclick ? isActive : undefined}
	>
		<CardCornerBadge cardNumber={card.cardNumber} rarity={card.rarity} />
		<div class="absolute" style="top: 8px; left: 8px; z-index: 2;">
			<PointBadge points={card.pointValue} />
		</div>
		<!-- Content row: starts at badge right edge + 2px; min-height 67px clears the absolute badge -->
		<div class="relative flex items-center z-[3]" style="padding-left: 69px; min-height: 67px;">
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
			<div class="flex min-w-0 flex-1 items-center py-1 px-2">
				<span
					class="truncate font-semibold"
					style="font-family: 'Cinzel', serif; font-size: {nameFontSize}; font-variant: small-caps;"
				>{card.name}</span>
			</div>
		</div>
		{#if card.ability}
			<div
				class="border-2 border-black px-2 py-1 mb-1.5"
				style="margin-left: 8px; width: 300px; font-family: 'EB Garamond', serif; font-size: 12px; line-height: 15px; text-align: center;"
			>{card.ability}</div>
		{/if}
	</div>
{/if}
