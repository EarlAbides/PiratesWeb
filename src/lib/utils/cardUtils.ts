import type { Card } from '$lib/types/cardTypes';
import type { Nationality } from '$lib/types/cardTypes';
import { base } from '$app/paths';

export function thumbUrl(card: Card): string {
	const webpName = card.imageFilename.replace(/\.[^.]+$/, '.webp');
	return `${base}/images/thumbs/${webpName}`;
}

export function imageUrl(card: Card): string {
	return `${base}/images/cards/${card.imageFilename}`;
}

export function flagUrl(nationality: Nationality): string {
	return `${base}/images/flags/${nationality.toLowerCase()}.svg`;
}
