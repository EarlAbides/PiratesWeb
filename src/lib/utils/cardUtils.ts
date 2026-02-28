import type { Card } from '$lib/types/cardTypes';

export function thumbUrl(card: Card): string {
	const webpName = card.imageFilename.replace(/\.jpg$/i, '.webp');
	return `/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
	return `/images/cards/${card.imageFilename}`;
}

export function formatMove(baseMove: string): string {
	return baseMove; // e.g., "S+L", "L", "S+S+L" — display as-is
}
