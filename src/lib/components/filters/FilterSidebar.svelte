<script lang="ts">
	import { filterState, type SortColumn } from '$lib/state/filterState.svelte';
	import { cardData } from '$lib/state/cardData.svelte';
	import { SET_LABEL } from '$lib/utils/setUtils';
	import SearchInput from './SearchInput.svelte';
	import FilterChip from './FilterChip.svelte';

	const sortOptions: { label: string; column: SortColumn }[] = [
		{ label: 'Pts', column: 'pointValue' },
		{ label: 'Name', column: 'name' },
		{ label: 'Type', column: 'type' },
		{ label: 'Set', column: 'cardSet' },
		{ label: 'Nation', column: 'nationality' }
	];
</script>

<div class="flex h-full flex-col gap-4 p-4">
	<!-- Search -->
	<SearchInput
		value={filterState.searchText}
		onchange={(v) => {
			filterState.searchText = v;
		}}
	/>

	<!-- Sort -->
	<div class="space-y-1.5">
		<p class="text-xs uppercase tracking-widest text-yellow-500/70" style="font-family: 'Cinzel', serif;">Sort</p>
		<div class="flex flex-wrap gap-1">
			{#each sortOptions as { label, column }}
				<button
					class="btn btn-xs {filterState.sortColumn === column ? 'btn-neutral' : 'btn-ghost opacity-60'}"
					onclick={() => filterState.setSort(column)}
				>
					{label}{filterState.sortColumn === column ? (filterState.sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
				</button>
			{/each}
		</div>
	</div>

	<!-- Dropdowns -->
	<div class="flex flex-col gap-3">
		<div>
			<label for="filter-set" class="mb-1 block text-xs uppercase tracking-widest text-yellow-500/70" style="font-family: 'Cinzel', serif;">Expansion Set</label>
			<select id="filter-set" bind:value={filterState.selectedSet} class="select select-sm w-full">
				<option value="">All</option>
				<option value="PPSM">{SET_LABEL.PPSM}</option>
				<option value="PPCC">{SET_LABEL.PPCC}</option>
				<option value="PPRV">{SET_LABEL.PPRV}</option>
			</select>
		</div>
		<div>
			<label for="filter-type" class="mb-1 block text-xs uppercase tracking-widest text-yellow-500/70" style="font-family: 'Cinzel', serif;">Card Type</label>
			<select id="filter-type" bind:value={filterState.selectedType} class="select select-sm w-full">
				<option value="">All</option>
				<option value="Ship">Ship</option>
				<option value="Crew">Crew</option>
				<option value="Treasure">Treasure</option>
				<option value="Fort">Fort</option>
				<option value="Event">Event</option>
			</select>
		</div>
		<div>
			<label for="filter-nationality" class="mb-1 block text-xs uppercase tracking-widest text-yellow-500/70" style="font-family: 'Cinzel', serif;">Nationality</label>
			<select id="filter-nationality" bind:value={filterState.selectedNationality} class="select select-sm w-full">
				<option value="">All</option>
				<option value="English">English</option>
				<option value="Spanish">Spanish</option>
				<option value="Pirates">Pirates</option>
				<option value="French">French</option>
				<option value="American">American</option>
				<option value="Barbary">Barbary</option>
			</select>
		</div>
		<div>
			<label for="filter-rarity" class="mb-1 block text-xs uppercase tracking-widest text-yellow-500/70" style="font-family: 'Cinzel', serif;">Rarity</label>
			<select id="filter-rarity" bind:value={filterState.selectedRarity} class="select select-sm w-full">
				<option value="">All</option>
				<option value="Common">Common</option>
				<option value="Uncommon">Uncommon</option>
				<option value="Rare">Rare</option>
				<option value="Super Rare">Super Rare</option>
				<option value="Limited Edition">Limited Edition</option>
				<option value="Common Treasure">Common Treasure</option>
				<option value="Treasure">Treasure</option>
				<option value="Super Rare Treasure">Super Rare Treasure</option>
			</select>
		</div>
	</div>

	<!-- Active filter chips -->
	{#if filterState.activeFilterCount > 0}
		<div class="flex flex-wrap gap-1">
			{#if filterState.selectedSet}
				<FilterChip
					label="Set: {SET_LABEL[filterState.selectedSet]}"
					onremove={() => {
						filterState.selectedSet = '';
					}}
				/>
			{/if}
			{#if filterState.selectedType}
				<FilterChip
					label="Type: {filterState.selectedType}"
					onremove={() => {
						filterState.selectedType = '';
					}}
				/>
			{/if}
			{#if filterState.selectedNationality}
				<FilterChip
					label="Nationality: {filterState.selectedNationality}"
					onremove={() => {
						filterState.selectedNationality = '';
					}}
				/>
			{/if}
			{#if filterState.selectedRarity}
				<FilterChip
					label="Rarity: {filterState.selectedRarity}"
					onremove={() => {
						filterState.selectedRarity = '';
					}}
				/>
			{/if}
			{#if filterState.searchText}
				<FilterChip
					label='Search: "{filterState.searchText}"'
					onremove={() => {
						filterState.searchText = '';
					}}
				/>
			{/if}
		</div>
		<button class="btn btn-ghost btn-xs self-start" onclick={() => filterState.clearAllFilters()}>
			Clear All
		</button>
	{/if}

	<!-- Result count — mt-auto pushes to bottom -->
	<p class="mt-auto text-xs text-neutral-500">
		Showing {filterState.filteredCards.length.toLocaleString()} of {cardData.cards.length.toLocaleString()} cards
	</p>
</div>
