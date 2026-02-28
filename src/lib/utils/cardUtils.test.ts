import { describe, it, expect } from 'vitest';
import { thumbUrl, imageUrl, flagUrl } from './cardUtils';
import type { Card } from '$lib/types/cardTypes';

const mockShip: Card = {
	cardId: '1234',
	cardSet: 'PPSM',
	cardNumber: 'EC-001',
	name: 'Test Ship',
	type: 'Ship',
	rarity: 'Rare',
	nationality: 'English',
	pointValue: 5,
	imageFilename: 'PPSM_EC-001.jpg',
	ability: 'Test ability',
	description: 'Test description',
	modifiers: {},
	details: { masts: 3, cargo: 4, baseMove: 'S+L', cannons: ['3S', '3L', '3S'] }
};

const mockCrewWithUnderscore: Card = {
	...mockShip,
	cardNumber: '046_2',
	type: 'Crew',
	imageFilename: 'PPCC_046_2.jpg',
	details: { buildBonus: 0, costReduction: 0, cargoBonus: 0, limitCards: [] }
};

describe('thumbUrl', () => {
	it('converts .jpg to .webp and prepends thumbs path', () => {
		expect(thumbUrl(mockShip)).toBe('/images/thumbs/PPSM_EC-001.webp');
	});
	it('handles underscores in filename correctly', () => {
		expect(thumbUrl(mockCrewWithUnderscore)).toBe('/images/thumbs/PPCC_046_2.webp');
	});
});

describe('imageUrl', () => {
	it('prepends cards path to imageFilename', () => {
		expect(imageUrl(mockShip)).toBe('/images/cards/PPSM_EC-001.jpg');
	});
	it('works for non-Ship card types', () => {
		expect(imageUrl(mockCrewWithUnderscore)).toBe('/images/cards/PPCC_046_2.jpg');
	});
});

describe('flagUrl', () => {
	it('returns lowercase svg path for each nationality', () => {
		expect(flagUrl('English')).toContain('english.svg');
		expect(flagUrl('Spanish')).toContain('spanish.svg');
		expect(flagUrl('Pirates')).toContain('pirates.svg');
		expect(flagUrl('French')).toContain('french.svg');
		expect(flagUrl('American')).toContain('american.svg');
		expect(flagUrl('Barbary')).toContain('barbary.svg');
	});
});
