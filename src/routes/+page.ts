import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Card } from '$lib/types/cardTypes';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`${base}/data/cards.json`);
	if (!res.ok) {
		throw error(500, 'Failed to load card data');
	}
	const data: unknown = await res.json();
	if (
		!Array.isArray(data) ||
		data.length === 0 ||
		typeof (data[0] as Record<string, unknown>).cardId !== 'string'
	) {
		throw error(500, 'Card data is malformed or empty');
	}
	const cards = data as Card[];
	return { cards };
};
