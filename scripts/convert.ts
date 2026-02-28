import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const CARD_SET_MAP: Record<string, string> = {
  'Pirates of the Spanish Main': 'PPSM',
  'Pirates of the Crimson Coast': 'PPCC',
  'Pirates of the Revolution': 'PPRV',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: '_text',
  isArray: (name: string) => name === 'Card' || name === 'Cannon',
});

const xmlPath = resolve('reference/PiratesCards.xml');
const xml = readFileSync(xmlPath, 'utf-8');
const parsed = parser.parse(xml);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawCards = parsed.Cards.Card as any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCannons(cardCannons: any): string[] {
  if (!cardCannons || !cardCannons.Cannon) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cannons: any[] = Array.isArray(cardCannons.Cannon)
    ? cardCannons.Cannon
    : [cardCannons.Cannon];
  return cannons
    .sort((a, b) => parseInt(String(a.Number), 10) - parseInt(String(b.Number), 10))
    .map((c) => `${c.Accuracy}${c.Range}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseModifiers(modifiers: any): Record<string, unknown> {
  if (!modifiers) return {};
  const result: Record<string, unknown> = {};
  if (modifiers.Limit === 'True') result.limit = true;
  if (modifiers.BuildBonus !== undefined)
    result.buildBonus = parseInt(String(modifiers.BuildBonus), 10);
  if (modifiers.CrewCostReduction !== undefined)
    result.crewCostReduction = parseInt(String(modifiers.CrewCostReduction), 10);
  if (modifiers.CargoBonus !== undefined)
    result.cargoBonus = parseInt(String(modifiers.CargoBonus), 10);
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cards = rawCards.map((card: any) => {
  const ident = card.Identification ?? {};
  const stats = card.Stats ?? {};
  const image = card.Image ?? {};
  const modifiers = card.Modifiers ?? {};
  const type = String(card.Type);

  const base: Record<string, unknown> = {
    cardId: String(card.CardID),
    cardSet: CARD_SET_MAP[card.CardSet as string] ?? card.CardSet,
    cardNumber: String(ident.CardNumber ?? ''),
    name: String(ident.Name ?? ''),
    type,
    rarity: card.Rarity,
    nationality: card.Nationality,
    tournamentStatus: card.TournamentStatus,
    pointValue: parseInt(String(stats.PointValue ?? '0'), 10),
    imageFilename: String(image.Filename ?? ''),
    ability: typeof card.Ability === 'string' ? card.Ability : '',
    description: typeof card.Description === 'string' ? card.Description : '',
    modifiers: parseModifiers(modifiers),
  };

  if (type === 'Ship') {
    base.details = {
      masts: parseInt(String(stats.Masts ?? '0'), 10),
      cargo: parseInt(String(stats.Cargo ?? '0'), 10),
      baseMove: String(stats.Movement ?? ''),
      cannons: parseCannons(card.Cannons),
    };
  } else if (type === 'Crew') {
    const linkCardIds = ident.LinkCardIDs;
    base.details = {
      buildBonus: parseInt(String(modifiers.BuildBonus ?? '0'), 10),
      costReduction: parseInt(String(modifiers.CrewCostReduction ?? '0'), 10),
      cargoBonus: parseInt(String(modifiers.CargoBonus ?? '0'), 10),
      limitCards: linkCardIds
        ? String(linkCardIds)
            .split(',')
            .map((s: string) => s.trim())
        : [],
    };
  } else if (type === 'Fort') {
    base.details = {
      cannons: parseCannons(card.Cannons),
      goldCost: parseInt(String(stats.GoldCost ?? '0'), 10),
    };
  }
  // Treasure and Event: no details key

  return base;
});

mkdirSync('static/data', { recursive: true });
writeFileSync('static/data/cards.json', JSON.stringify(cards));
console.log(`✅ Converted ${cards.length} cards → static/data/cards.json`);
