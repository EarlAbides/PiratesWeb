import { describe, it, expect } from 'vitest';
import { parseCannonPip } from './index';

describe('parseCannonPip', () => {
	it('parses all valid short cannon strings (digit-first format)', () => {
		for (let roll = 1; roll <= 6; roll++) {
			const result = parseCannonPip(`${roll}S`);
			expect(result).toEqual({ type: 'S', roll });
		}
	});

	it('parses all valid long cannon strings (digit-first format)', () => {
		for (let roll = 1; roll <= 6; roll++) {
			const result = parseCannonPip(`${roll}L`);
			expect(result).toEqual({ type: 'L', roll });
		}
	});

	it('throws TypeError for invalid type', () => {
		expect(() => parseCannonPip('3X')).toThrow(TypeError);
	});

	it('throws TypeError for invalid roll', () => {
		expect(() => parseCannonPip('7S')).toThrow(TypeError);
	});

	it('throws TypeError for empty string', () => {
		expect(() => parseCannonPip('')).toThrow(TypeError);
	});

	it('throws TypeError for string with trailing garbage', () => {
		expect(() => parseCannonPip('3Sabc')).toThrow(TypeError);
	});
});
