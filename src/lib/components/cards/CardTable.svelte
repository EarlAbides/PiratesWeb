<script lang="ts">
	import { filterState } from '$lib/state/filterState.svelte';
	import CardRow from './CardRow.svelte';
	import CardPeek from './CardPeek.svelte';

	let peekedCardId = $state<string | null>(null);
	let peekRowEl = $state<HTMLElement | null>(null);
	let rowEls: Record<string, HTMLElement> = {};

	// Close popover when filtered cards change (filter/sort applied)
	// Compare serialized card IDs — array references change on every derived re-evaluation
	let prevCardIds = $state(filterState.filteredCards.map((c) => c.cardId).join(','));
	$effect(() => {
		const ids = filterState.filteredCards.map((c) => c.cardId).join(',');
		if (ids !== prevCardIds) {
			peekedCardId = null;
			peekRowEl = null;
			prevCardIds = ids;
		}
	});

	function togglePeek(cardId: string) {
		if (peekedCardId === cardId) {
			peekedCardId = null;
			peekRowEl = null;
		} else {
			peekedCardId = cardId;
			peekRowEl = rowEls[cardId] ?? null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && peekedCardId !== null) {
			peekedCardId = null;
			if (peekRowEl) {
				peekRowEl.focus();
				peekRowEl = null;
			}
		}
	}

	function handleClickOutside(e: MouseEvent) {
		if (peekedCardId === null) return;
		const target = e.target as HTMLElement;
		// If click is inside a card-peek or card-row, let the row handler manage it
		if (target.closest('.card-peek') || target.closest('[data-card-row]')) return;
		if (peekRowEl) {
			peekRowEl.focus();
		}
		peekedCardId = null;
		peekRowEl = null;
	}

	function scrollPeekIntoView(node: HTMLElement) {
		node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col h-full" onclick={handleClickOutside} role="presentation">
	<!-- Card list -->
	<div class="overflow-y-auto flex-1">
		<div class="flex flex-col gap-3 p-3">
			{#each filterState.filteredCards as card (card.cardId)}
				<div data-card-row bind:this={rowEls[card.cardId]}>
					<CardRow
						{card}
						onclick={() => togglePeek(card.cardId)}
						isActive={peekedCardId === card.cardId}
					/>
					{#if peekedCardId === card.cardId}
						<div
							class="card-peek-container flex justify-center py-2 animate-fade-in"
							use:scrollPeekIntoView
						>
							<CardPeek {card} />
						</div>
					{/if}
				</div>
			{:else}
				<p class="p-4 text-neutral-400 text-sm">No cards match your current filters.</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.animate-fade-in {
		animation: fadeSlideIn 200ms ease-out;
	}
	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
