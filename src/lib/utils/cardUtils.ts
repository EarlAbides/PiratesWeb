import type { Card } from '$lib/types/cardTypes';

export function thumbUrl(card: Card): string {
	const webpName = card.imageFilename.replace(/\.[^.]+$/, '.webp');
	return `/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
	return `/images/cards/${card.imageFilename}`;
}
