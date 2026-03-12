<script lang="ts">
	import type { Card } from '$lib/types/cardTypes';
	import { imageUrl } from '$lib/utils/cardUtils';
	import { formatModifierKey, formatModifierValue } from '$lib/utils/modifierUtils';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();

	let imageError = $state(false);

	const hasDescription = $derived(card.description && card.description.trim().length > 0);
	const hasModifiers = $derived(card.modifiers && Object.keys(card.modifiers).length > 0);
</script>

<div
	class="card-peek max-w-[300px] overflow-hidden rounded-lg border border-neutral-600 bg-neutral-900/95 shadow-xl"
>
	<!-- Card image -->
	<div class="flex justify-center p-3 pb-0">
		{#if imageError}
			<div
				class="flex w-[260px] h-[180px] items-center justify-center rounded bg-neutral-800 border border-neutral-600"
			>
				<span class="text-neutral-500 text-sm italic" style="font-family: 'EB Garamond', serif;">Image not available</span>
			</div>
		{:else}
			<img
				src={imageUrl(card)}
				alt={card.name}
				loading="lazy"
				class="w-[260px] rounded border border-neutral-600"
				onerror={() => { imageError = true; }}
			/>
		{/if}
	</div>

	<!-- Description / flavor text -->
	{#if hasDescription}
		<div
			class="mx-3 mt-3 border-l-2 border-amber-600 pl-3 py-1"
		>
			<p
				class="text-neutral-200 italic"
				style="font-family: 'EB Garamond', serif; font-size: 14px; line-height: 1.4;"
			>{card.description}</p>
		</div>
	{/if}

	<!-- Modifiers -->
	{#if hasModifiers}
		<div class="mx-3 mt-2 mb-1">
			<div class="text-xs text-neutral-400 uppercase tracking-wider mb-1" style="font-family: 'Cinzel', serif;">Modifiers</div>
			<div class="flex flex-col gap-0.5">
				{#each Object.entries(card.modifiers) as [key, value]}
					<div class="flex justify-between text-sm text-neutral-300" style="font-family: 'EB Garamond', serif;">
						<span>{formatModifierKey(key)}</span>
						<span class="text-amber-500 font-semibold">{formatModifierValue(value)}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Bottom padding -->
	<div class="h-3"></div>
</div>
