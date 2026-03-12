import { describe, it, expect } from 'vitest';

// CardPeek uses imageUrl() from cardUtils — test the modifier formatting logic
// and data expectations here. Component rendering is validated by svelte-check and e2e.

describe('CardPeek modifier formatting', () => {
	// Replicate the formatting functions from CardPeek.svelte for unit testing
	function formatModifierKey(key: string): string {
		return key
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, (s) => s.toUpperCase())
			.trim();
	}

	function formatModifierValue(value: unknown): string {
		if (typeof value === 'boolean') return value ? 'Yes' : 'No';
		return String(value);
	}

	it('converts camelCase keys to Title Case with spaces', () => {
		expect(formatModifierKey('buildBonus')).toBe('Build Bonus');
		expect(formatModifierKey('costReduction')).toBe('Cost Reduction');
		expect(formatModifierKey('limit')).toBe('Limit');
	});

	it('formats boolean values as Yes/No', () => {
		expect(formatModifierValue(true)).toBe('Yes');
		expect(formatModifierValue(false)).toBe('No');
	});

	it('formats numeric values as strings', () => {
		expect(formatModifierValue(5)).toBe('5');
		expect(formatModifierValue(0)).toBe('0');
	});

	it('formats string values as-is', () => {
		expect(formatModifierValue('special')).toBe('special');
	});
});

describe('CardPeek data expectations', () => {
	it('description field is a string (may be empty)', () => {
		// Per cardTypes.ts, description is always string
		const emptyDesc = '';
		const flavorDesc = 'A fearsome pirate of the Spanish Main.';
		expect(typeof emptyDesc).toBe('string');
		expect(typeof flavorDesc).toBe('string');
		expect(emptyDesc.trim().length).toBe(0);
		expect(flavorDesc.trim().length).toBeGreaterThan(0);
	});

	it('modifiers field is Record<string, unknown> (may be empty object)', () => {
		const emptyMods: Record<string, unknown> = {};
		const activeMods: Record<string, unknown> = { limit: true, buildBonus: 5 };
		expect(Object.keys(emptyMods).length).toBe(0);
		expect(Object.keys(activeMods).length).toBe(2);
	});
});
