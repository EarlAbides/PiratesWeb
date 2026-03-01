import { describe, it, expect } from 'vitest';
import { applyFilters, matchesSearch } from './filterUtils';
import type { Card } from '$lib/types/cardTypes';

// Minimal card stubs for filter testing
const makeCard = (overrides: Partial<Card>): Card =>
	({
		cardId: 'test-1',
		cardSet: 'PPSM',
		cardNumber: '001',
		name: 'Test Ship',
		type: 'Ship',
		rarity: 'Common',
		nationality: 'English',
		pointValue: 5,
		imageFilename: 'test.jpg',
		ability: 'No ability.',
		description: '',
		modifiers: {},
		details: { masts: 2, cargo: 3, baseMove: 'S+S', cannons: ['3S', '3S'] },
		...overrides
	}) as Card;

const cards: Card[] = [
	makeCard({ cardId: '1', name: 'HMS Victory', cardSet: 'PPSM', type: 'Ship', nationality: 'English', rarity: 'Rare', ability: 'Boarding specialist.' }),
	makeCard({ cardId: '2', name: 'El Diablo', cardSet: 'PPCC', type: 'Ship', nationality: 'Spanish', rarity: 'Common', ability: 'Fast ship.' }),
	makeCard({ cardId: '3', name: 'Blackbeard', cardSet: 'PPSM', type: 'Crew', nationality: 'Pirates', rarity: 'Rare', ability: 'Eliminate one crew.' }),
	makeCard({ cardId: '4', name: 'Gold Chest', cardSet: 'PPRV', type: 'Treasure', nationality: 'English', rarity: 'Common', ability: '' }),
];

const empty = { selectedSet: '' as const, selectedType: '' as const, selectedNationality: '' as const, selectedRarity: '' as const, searchText: '' };

describe('applyFilters', () => {
	it('returns all cards when no filters active', () => {
		expect(applyFilters(cards, empty)).toHaveLength(4);
	});

	it('filters by set', () => {
		const result = applyFilters(cards, { ...empty, selectedSet: 'PPSM' });
		expect(result).toHaveLength(2);
		expect(result.every((c) => c.cardSet === 'PPSM')).toBe(true);
	});

	it('filters by type', () => {
		const result = applyFilters(cards, { ...empty, selectedType: 'Ship' });
		expect(result).toHaveLength(2);
		expect(result.every((c) => c.type === 'Ship')).toBe(true);
	});

	it('filters by nationality', () => {
		const result = applyFilters(cards, { ...empty, selectedNationality: 'English' });
		expect(result).toHaveLength(2);
		expect(result.every((c) => c.nationality === 'English')).toBe(true);
	});

	it('filters by rarity', () => {
		const result = applyFilters(cards, { ...empty, selectedRarity: 'Rare' });
		expect(result).toHaveLength(2);
		expect(result.every((c) => c.rarity === 'Rare')).toBe(true);
	});

	it('applies AND logic across multiple filters', () => {
		const result = applyFilters(cards, { ...empty, selectedSet: 'PPSM', selectedType: 'Ship' });
		expect(result).toHaveLength(1);
		expect(result[0].cardId).toBe('1');
	});

	it('searches name case-insensitively', () => {
		const result = applyFilters(cards, { ...empty, searchText: 'victory' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('HMS Victory');
	});

	it('searches ability text', () => {
		const result = applyFilters(cards, { ...empty, searchText: 'boarding' });
		expect(result).toHaveLength(1);
		expect(result[0].cardId).toBe('1');
	});

	it('ignores whitespace-only search text', () => {
		const result = applyFilters(cards, { ...empty, searchText: '   ' });
		expect(result).toHaveLength(4);
	});

	it('returns empty array when no cards match', () => {
		const result = applyFilters(cards, { ...empty, selectedSet: 'PPSM', selectedNationality: 'French' });
		expect(result).toHaveLength(0);
	});

	it('does not mutate the input array', () => {
		const input = [...cards];
		applyFilters(input, { ...empty, selectedType: 'Crew' });
		expect(input).toHaveLength(4);
	});
});

describe('matchesSearch', () => {
	const card = makeCard({ name: 'HMS Victory', ability: 'Boarding specialist.' });

	it('returns true when query is empty', () => {
		expect(matchesSearch(card, '')).toBe(true);
	});

	it('returns true when query is whitespace only', () => {
		expect(matchesSearch(card, '   ')).toBe(true);
	});

	it('matches exact card name', () => {
		expect(matchesSearch(card, 'HMS Victory')).toBe(true);
	});

	it('matches partial card name', () => {
		expect(matchesSearch(card, 'HMS')).toBe(true);
	});

	it('is case-insensitive on name', () => {
		expect(matchesSearch(card, 'victory')).toBe(true);
	});

	it('matches ability text', () => {
		expect(matchesSearch(card, 'boarding')).toBe(true);
	});

	it('is case-insensitive on ability', () => {
		expect(matchesSearch(card, 'BOARDING')).toBe(true);
	});

	it('returns false when no match', () => {
		expect(matchesSearch(card, 'zzzzzz')).toBe(false);
	});
});
