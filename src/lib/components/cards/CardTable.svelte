<script lang="ts">
	import { filterState } from '$lib/state/filterState.svelte';
	import CardRow from './CardRow.svelte';
</script>

<div class="flex flex-col h-full">
	<!-- Card list -->
	<div class="overflow-y-auto flex-1">
		<div class="flex flex-col gap-3 p-3">
			{#each filterState.filteredCards as card (card.cardId)}
				<CardRow {card} />
			{:else}
				<p class="p-4 text-neutral-400 text-sm">No cards match your current filters.</p>
			{/each}
		</div>
	</div>
</div>
