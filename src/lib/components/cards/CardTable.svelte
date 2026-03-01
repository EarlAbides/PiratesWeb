<script lang="ts">
	import { filterState, type SortColumn } from '$lib/state/filterState.svelte';
	import CardRow from './CardRow.svelte';

	const headers: { label: string; column: SortColumn; extraClass: string }[] = [
		{ label: 'Pts', column: 'pointValue', extraClass: 'w-12 shrink-0 justify-center' },
		{ label: 'Name', column: 'name', extraClass: 'flex-1' },
		{ label: 'Nationality', column: 'nationality', extraClass: 'shrink-0' },
		{ label: 'Type', column: 'type', extraClass: 'shrink-0' },
		{ label: 'Set', column: 'cardSet', extraClass: 'shrink-0' }
	];

	function ariaLabel(h: (typeof headers)[number]): string {
		if (filterState.sortColumn !== h.column) return `Sort by ${h.label}`;
		const dir = filterState.sortDirection === 'asc' ? 'ascending' : 'descending';
		const next = filterState.sortDirection === 'asc' ? 'descending' : 'ascending';
		return `Sorted by ${h.label} ${dir}. Click to sort ${next}`;
	}
</script>

<div class="flex flex-col h-full">
	<!-- Sort headers — Pts column (w-12) aligns with PointBadge; Name (flex-1) with card name column -->
	<div
		class="flex items-center gap-3 px-3 py-2 text-xs font-medium text-neutral-400 border-b border-neutral-700 shrink-0"
	>
		{#each headers as h}
			<button
				class="flex items-center gap-1 hover:text-neutral-100 transition-colors {h.extraClass}"
				onclick={() => filterState.setSort(h.column)}
				aria-label={ariaLabel(h)}
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
		{:else}
			<p class="p-4 text-neutral-400 text-sm">No cards match your current filters.</p>
		{/each}
	</div>
</div>
