import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Card } from '$lib/types/cardTypes';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/data/cards.json');
	if (!res.ok) {
		throw error(500, 'Failed to load card data');
	}
	const cards: Card[] = await res.json();
	return { cards };
};
