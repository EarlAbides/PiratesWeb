import { describe, it, expect } from 'vitest';
import { SET_CLASS } from '../../utils/setUtils';

// SET_CLASS is defined in src/lib/utils/setUtils.ts and imported by both
// CardRow.svelte (for runtime rendering) and this test file (for logic validation).
// Type correctness of the full component is validated by `npm run check`.

describe('CardRow set background class mapping', () => {
	it('maps PPSM (Spanish Main) to bg-set-spanish-main', () => {
		expect(SET_CLASS['PPSM']).toBe('bg-set-spanish-main');
	});

	it('maps PPCC (Crimson Coast) to bg-set-crimson-coast', () => {
		expect(SET_CLASS['PPCC']).toBe('bg-set-crimson-coast');
	});

	it('maps PPRV (Revolution) to bg-set-revolution', () => {
		expect(SET_CLASS['PPRV']).toBe('bg-set-revolution');
	});

	it('returns undefined for an unknown card set (graceful fallback via ?? empty string)', () => {
		expect(SET_CLASS['UNKNOWN']).toBeUndefined();
		// CardRow uses: SET_CLASS[card.cardSet] ?? '' — so undefined safely falls back to ''
		expect(SET_CLASS['UNKNOWN'] ?? '').toBe('');
	});

	it('covers all three canonical card sets', () => {
		const cardSets = ['PPSM', 'PPCC', 'PPRV'];
		for (const set of cardSets) {
			expect(SET_CLASS[set]).toBeTruthy();
			expect(SET_CLASS[set]).toMatch(/^bg-set-/);
		}
	});
});
