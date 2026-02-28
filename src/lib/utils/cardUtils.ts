import type { Card } from '$lib/types/cardTypes';
import { base } from '$app/paths';

export function thumbUrl(card: Card): string {
	const webpName = card.imageFilename.replace(/\.[^.]+$/, '.webp');
	return `${base}/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
	return `${base}/images/cards/${card.imageFilename}`;
}
