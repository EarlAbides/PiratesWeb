<script lang="ts">
	import { filterState, type SortColumn } from '$lib/state/filterState.svelte';
	import CardRow from './CardRow.svelte';

	const headers: { label: string; column: SortColumn }[] = [
		{ label: 'Pts', column: 'pointValue' },
		{ label: 'Name', column: 'name' },
		{ label: 'Type', column: 'type' },
		{ label: 'Set', column: 'cardSet' },
		{ label: 'Nationality', column: 'nationality' }
	];
</script>

<div class="flex flex-col h-full">
	<!-- Sort headers -->
	<div
		class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-700 shrink-0"
	>
		{#each headers as h}
			<button
				class="flex items-center gap-1 hover:text-neutral-100 transition-colors"
				onclick={() => filterState.setSort(h.column)}
			>
				{h.label}
				{#if filterState.sortColumn === h.column}
					<span>{filterState.sortDirection === 'asc' ? '▲' : '▼'}</span>
				{/if}
			</button>
		{/each}
		<span class="ml-auto text-neutral-500">{filterState.filteredCards.length} cards</span>
	</div>

	<!-- Card list -->
	<div class="overflow-y-auto flex-1">
		{#each filterState.filteredCards as card (card.cardId)}
			<CardRow {card} />
		{/each}
		{#if filterState.filteredCards.length === 0}
			<p class="p-4 text-neutral-400 text-sm">No cards match your current filters.</p>
		{/if}
	</div>
</div>
