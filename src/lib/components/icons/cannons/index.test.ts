import { describe, it, expect } from 'vitest';
import { parseCannonPip } from './index';

describe('parseCannonPip', () => {
	it('parses all valid short cannon strings', () => {
		for (let roll = 1; roll <= 6; roll++) {
			const result = parseCannonPip(`S${roll}`);
			expect(result).toEqual({ type: 'S', roll });
		}
	});

	it('parses all valid long cannon strings', () => {
		for (let roll = 1; roll <= 6; roll++) {
			const result = parseCannonPip(`L${roll}`);
			expect(result).toEqual({ type: 'L', roll });
		}
	});

	it('throws TypeError for invalid type', () => {
		expect(() => parseCannonPip('X3')).toThrow(TypeError);
	});

	it('throws TypeError for invalid roll', () => {
		expect(() => parseCannonPip('S7')).toThrow(TypeError);
	});

	it('throws TypeError for empty string', () => {
		expect(() => parseCannonPip('')).toThrow(TypeError);
	});

	it('throws TypeError for string with trailing garbage', () => {
		expect(() => parseCannonPip('S3abc')).toThrow(TypeError);
	});
});
