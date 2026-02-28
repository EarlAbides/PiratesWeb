export type CardSet = 'PPSM' | 'PPCC' | 'PPRV';

export type CardType = 'Ship' | 'Crew' | 'Treasure' | 'Fort' | 'Event';

export type Rarity =
	| 'Common'
	| 'Uncommon'
	| 'Rare'
	| 'Super Rare'
	| 'Limited Edition'
	| 'Common Treasure'
	| 'Treasure'
	| 'Super Rare Treasure';

export type Nationality = 'English' | 'Spanish' | 'Pirates' | 'French' | 'American' | 'Barbary';

export interface ShipDetails {
	masts: number;
	cargo: number;
	baseMove: string;
	cannons: string[];
	// NOTE: crewSlots intentionally omitted — absent from source XML and cards.json
}

export interface CrewDetails {
	buildBonus: number;
	costReduction: number;
	cargoBonus: number;
	limitCards: string[];
}

export interface FortDetails {
	cannons: string[];
	goldCost: number;
}

export interface BaseCard {
	cardId: string;
	cardSet: CardSet;
	cardNumber: string;
	name: string;
	type: CardType;
	rarity: Rarity;
	nationality: Nationality;
	pointValue: number;
	imageFilename: string;
	ability: string;
	description: string;
	modifiers: Record<string, unknown>;
}

export interface ShipCard extends BaseCard {
	type: 'Ship';
	details: ShipDetails;
}

export interface CrewCard extends BaseCard {
	type: 'Crew';
	details: CrewDetails;
}

export interface TreasureCard extends BaseCard {
	type: 'Treasure';
	// no details property
}

export interface FortCard extends BaseCard {
	type: 'Fort';
	details: FortDetails;
}

export interface EventCard extends BaseCard {
	type: 'Event';
	// no details property
}

export type Card = ShipCard | CrewCard | TreasureCard | FortCard | EventCard;
