<script lang="ts">
	import type { Card } from '$lib/types/cardTypes';
	import { imageUrl } from '$lib/utils/cardUtils';

	interface Props {
		card: Card;
	}

	const { card }: Props = $props();

	let imageError = $state(false);

	const hasDescription = $derived(card.description && card.description.trim().length > 0);
	const hasModifiers = $derived(card.modifiers && Object.keys(card.modifiers).length > 0);

	function formatModifierKey(key: string): string {
		return key
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (s) => s.toUpperCase())
			.trim();
	}

	function formatModifierValue(value: unknown): string {
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		return String(value);
	}
</script>

<div
	class="card-peek overflow-hidden rounded-lg border border-neutral-600 bg-neutral-900/95 shadow-xl"
	style="max-width: 300px;"
>
	<!-- Card image -->
	<div class="flex justify-center p-3 pb-0">
		{#if imageError}
			<div
				class="flex items-center justify-center rounded bg-neutral-800 border border-neutral-600"
				style="width: 260px; height: 180px;"
			>
				<span class="text-neutral-500 text-sm italic" style="font-family: 'EB Garamond', serif;">Image not available</span>
			</div>
		{:else}
			<img
				src={imageUrl(card)}
				alt={card.name}
				loading="lazy"
				class="rounded border border-neutral-600"
				style="width: 260px; height: auto;"
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
