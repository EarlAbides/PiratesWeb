import type { Card } from '$lib/types/cardTypes';

class CardDataStore {
	cards = $state<Card[]>([]);
	cardById = $derived.by(() => new Map(this.cards.map((c) => [c.cardId, c])));

	setCards(newCards: Card[]) {
		this.cards = newCards;
	}
}

export const cardData = new CardDataStore();
