/**
 * Format a camelCase modifier key to Title Case with spaces.
 * e.g., "buildBonus" → "Build Bonus"
 */
export function formatModifierKey(key: string): string {
	return key
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (s) => s.toUpperCase())
		.trim();
}

/**
 * Format a modifier value for display.
 * Booleans become "Yes"/"No", everything else stringified.
 */
export function formatModifierValue(value: unknown): string {
	if (typeof value === 'boolean') return value ? 'Yes' : 'No';
	return String(value);
}
