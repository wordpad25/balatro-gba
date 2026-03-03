import {
  Joker,
  JokerEvent,
  ScoringContext,
  JokerEffect,
  Suit,
  Rank,
  HandType
} from '../types/game';

export const JOKER_REGISTRY: Record<number, Omit<Joker, 'id'>> = {
  0: {
    name: 'Joker',
    rarity: 0,
    value: 2,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.INDEPENDENT) {
        return { mult: 4 };
      }
      return {};
    }
  },
  1: {
    name: 'Greedy Joker',
    rarity: 0,
    value: 5,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.ON_CARD_SCORED && ctx.card?.suit === Suit.DIAMONDS) {
        return { mult: 3 };
      }
      return {};
    }
  },
  2: {
    name: 'Lusty Joker',
    rarity: 0,
    value: 5,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.ON_CARD_SCORED && ctx.card?.suit === Suit.HEARTS) {
        return { mult: 3 };
      }
      return {};
    }
  },
  3: {
    name: 'Wrathful Joker',
    rarity: 0,
    value: 5,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.ON_CARD_SCORED && ctx.card?.suit === Suit.SPADES) {
        return { mult: 3 };
      }
      return {};
    }
  },
  4: {
    name: 'Gluttonous Joker',
    rarity: 0,
    value: 5,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.ON_CARD_SCORED && ctx.card?.suit === Suit.CLUBS) {
        return { mult: 3 };
      }
      return {};
    }
  },
  5: {
    name: 'Jolly Joker',
    rarity: 0,
    value: 3,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.INDEPENDENT && ctx.gameState.containedHands.PAIR) {
        return { mult: 8 };
      }
      return {};
    }
  },
  15: {
    name: 'Half Joker',
    rarity: 0,
    value: 5,
    effect: (ctx) => {
      if (ctx.event === JokerEvent.INDEPENDENT && ctx.playedCards.length <= 3) {
        return { mult: 20 };
      }
      return {};
    }
  }
};

export function createJoker(id: number): Joker {
  const info = JOKER_REGISTRY[id];
  if (!info) throw new Error(`Joker ID ${id} not found`);
  return { id, ...info };
}
