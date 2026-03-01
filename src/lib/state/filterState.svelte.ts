import type { Card } from '$lib/types/cardTypes';
import { cardData } from '$lib/state/cardData.svelte';

export type SortColumn = 'pointValue' | 'name' | 'type' | 'cardSet' | 'nationality';
export type SortDirection = 'asc' | 'desc';

class FilterStateStore {
	sortColumn = $state<SortColumn>('pointValue');
	sortDirection = $state<SortDirection>('desc');

	// Story 2.3 will add: sets, types, nationalities, rarities, searchText filters here

	filteredCards = $derived.by<Card[]>(() => {
		// Story 2.3 will add filter application before sort
		const cards = [...cardData.cards];

		return cards.sort((a, b) => {
			const col = this.sortColumn;
			const dir = this.sortDirection === 'asc' ? 1 : -1;

			if (col === 'pointValue') {
				return (a.pointValue - b.pointValue) * dir;
			}
			// string columns: name, type, cardSet, nationality
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
}

export const filterState = new FilterStateStore();
