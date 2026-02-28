export type CannonType = 'S' | 'L';
export type CannonRoll = 1 | 2 | 3 | 4 | 5 | 6;

export interface CannonPipData {
	type: CannonType;
	roll: CannonRoll;
}

const VALID_TYPES = new Set<string>(['S', 'L']);
const VALID_ROLLS = new Set<number>([1, 2, 3, 4, 5, 6]);

export function parseCannonPip(cannon: string): CannonPipData {
	if (cannon.length !== 2) {
		throw new TypeError(`Invalid cannon pip string: "${cannon}". Expected format: S1–S6 or L1–L6.`);
	}
	const type = cannon[0];
	const roll = parseInt(cannon[1], 10);
	if (!VALID_TYPES.has(type) || !VALID_ROLLS.has(roll)) {
		throw new TypeError(`Invalid cannon pip string: "${cannon}". Expected format: S1–S6 or L1–L6.`);
	}
	return { type: type as CannonType, roll: roll as CannonRoll };
}
