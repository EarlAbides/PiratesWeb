<script lang="ts">
	import { filterState } from '$lib/state/filterState.svelte';
	import CardRow from './CardRow.svelte';
	import CardPeek from './CardPeek.svelte';

	let peekedCardId = $state<string | null>(null);
	let peekRowEl = $state<HTMLElement | null>(null);

	// Close popover when filtered cards change (filter/sort applied)
	let prevFilteredLength = $state(filterState.filteredCards.length);
	$effect(() => {
		const len = filterState.filteredCards.length;
		if (len !== prevFilteredLength) {
			peekedCardId = null;
			prevFilteredLength = len;
		}
	});

	function togglePeek(cardId: string, rowEl: HTMLElement) {
		if (peekedCardId === cardId) {
			peekedCardId = null;
			peekRowEl = null;
		} else {
			peekedCardId = cardId;
			peekRowEl = rowEl;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && peekedCardId !== null) {
			const id = peekedCardId;
			peekedCardId = null;
			// Return focus to the triggering row
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
		peekedCardId = null;
		peekRowEl = null;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col h-full" onclick={handleClickOutside} role="presentation">
	<!-- Card list -->
	<div class="overflow-y-auto flex-1">
		<div class="flex flex-col gap-3 p-3">
			{#each filterState.filteredCards as card (card.cardId)}
				<div data-card-row>
					<CardRow
						{card}
						onclick={() => {
							// Find the row element from the DOM
							const rows = document.querySelectorAll('[data-card-row]');
							const idx = filterState.filteredCards.findIndex(c => c.cardId === card.cardId);
							const rowEl = rows[idx] as HTMLElement;
							togglePeek(card.cardId, rowEl);
						}}
						isActive={peekedCardId === card.cardId}
					/>
					{#if peekedCardId === card.cardId}
						<div
							class="card-peek-container flex justify-center py-2 animate-fade-in"
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
