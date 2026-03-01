import type { Card, CardSet, CardType, Nationality, Rarity } from '$lib/types/cardTypes';

export interface FilterCriteria {
	selectedSet: CardSet | '';
	selectedType: CardType | '';
	selectedNationality: Nationality | '';
	selectedRarity: Rarity | '';
	searchText: string;
}

export function matchesSearch(card: Card, query: string): boolean {
	const trimmed = query.trim();
	if (!trimmed) return true;
	const q = trimmed.toLowerCase();
	return card.name.toLowerCase().includes(q) || card.ability.toLowerCase().includes(q);
}

export function applyFilters(cards: Card[], criteria: FilterCriteria): Card[] {
	let result = cards;
	if (criteria.selectedSet) result = result.filter((c) => c.cardSet === criteria.selectedSet);
	if (criteria.selectedType) result = result.filter((c) => c.type === criteria.selectedType);
	if (criteria.selectedNationality)
		result = result.filter((c) => c.nationality === criteria.selectedNationality);
	if (criteria.selectedRarity) result = result.filter((c) => c.rarity === criteria.selectedRarity);
	if (criteria.searchText.trim()) result = result.filter((c) => matchesSearch(c, criteria.searchText));
	return result;
}
