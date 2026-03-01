import type { Card, CardSet, CardType, Nationality, Rarity } from '$lib/types/cardTypes';
import { cardData } from '$lib/state/cardData.svelte';
import { applyFilters } from '$lib/utils/filterUtils';

export type SortColumn = 'pointValue' | 'name' | 'type' | 'cardSet' | 'nationality';
export type SortDirection = 'asc' | 'desc';

class FilterStateStore {
	// --- Sort state (from Story 2.2, unchanged) ---
	sortColumn = $state<SortColumn>('pointValue');
	sortDirection = $state<SortDirection>('desc');

	// --- Filter state (Story 2.3) ---
	selectedSet = $state<CardSet | ''>('');
	selectedType = $state<CardType | ''>('');
	selectedNationality = $state<Nationality | ''>('');
	selectedRarity = $state<Rarity | ''>('');
	searchText = $state<string>('');

	activeFilterCount = $derived(
		[this.selectedSet, this.selectedType, this.selectedNationality, this.selectedRarity, this.searchText.trim()]
			.filter(Boolean).length
	);

	filteredCards = $derived.by<Card[]>(() => {
		// Apply filters (AND logic) via extracted filterUtils (testable in isolation)
		let cards = applyFilters([...cardData.cards], {
			selectedSet: this.selectedSet,
			selectedType: this.selectedType,
			selectedNationality: this.selectedNationality,
			selectedRarity: this.selectedRarity,
			searchText: this.searchText
		});

		// Apply sort (same logic as Story 2.2)
		const col = this.sortColumn;
		const dir = this.sortDirection === 'asc' ? 1 : -1;
		return cards.sort((a, b) => {
			if (col === 'pointValue') return (a.pointValue - b.pointValue) * dir;
			const aVal = String(a[col as keyof Card] ?? '');
			const bVal = String(b[col as keyof Card] ?? '');
			return aVal.localeCompare(bVal) * dir;
		});
	});

	setSort(column: SortColumn) {
		if (this.sortColumn === column) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortColumn = column;
			// Default to desc for point value (show expensive cards first), asc for text columns
			this.sortDirection = column === 'pointValue' ? 'desc' : 'asc';
		}
	}

	clearAllFilters() {
		this.selectedSet = '';
		this.selectedType = '';
		this.selectedNationality = '';
		this.selectedRarity = '';
		this.searchText = '';
		// NOTE: intentionally does NOT reset sortColumn/sortDirection
	}
}

export const filterState = new FilterStateStore();
