import { describe, it, expect } from 'vitest';
import { formatModifierKey, formatModifierValue } from '$lib/utils/modifierUtils';

describe('formatModifierKey', () => {
	it('converts camelCase keys to Title Case with spaces', () => {
		expect(formatModifierKey('buildBonus')).toBe('Build Bonus');
		expect(formatModifierKey('costReduction')).toBe('Cost Reduction');
		expect(formatModifierKey('limit')).toBe('Limit');
	});

	it('handles already-capitalized single words', () => {
		expect(formatModifierKey('Limit')).toBe('Limit');
	});

	it('handles multi-hump camelCase', () => {
		expect(formatModifierKey('maxCrewSlots')).toBe('Max Crew Slots');
	});
});

describe('formatModifierValue', () => {
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

	it('formats null and undefined', () => {
		expect(formatModifierValue(null)).toBe('null');
		expect(formatModifierValue(undefined)).toBe('undefined');
	});
});
