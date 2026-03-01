import type { Card, CardSet, CardType, Nationality, Rarity } from '$lib/types/cardTypes';

export interface FilterCriteria {
	selectedSet: CardSet | '';
	selectedType: CardType | '';
	selectedNationality: Nationality | '';
	selectedRarity: Rarity | '';
	searchText: string;
}

export function applyFilters(cards: Card[], criteria: FilterCriteria): Card[] {
	let result = cards;
	if (criteria.selectedSet) result = result.filter((c) => c.cardSet === criteria.selectedSet);
	if (criteria.selectedType) result = result.filter((c) => c.type === criteria.selectedType);
	if (criteria.selectedNationality)
		result = result.filter((c) => c.nationality === criteria.selectedNationality);
	if (criteria.selectedRarity) result = result.filter((c) => c.rarity === criteria.selectedRarity);
	if (criteria.searchText.trim()) {
		const q = criteria.searchText.toLowerCase().trim();
		result = result.filter(
			(c) => c.name.toLowerCase().includes(q) || c.ability.toLowerCase().includes(q)
		);
	}
	return result;
}
