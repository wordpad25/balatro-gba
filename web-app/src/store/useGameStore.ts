import { create } from 'zustand';
import { Card, Joker, Suit, Rank, HandType, GameState, Edition, Rarity } from '../types/game';
import { determineHandType, getCardScoreValue } from '../logic/scoring';
import { applyJokerEffects } from '../logic/jokers';

interface GameActions {
  drawCards: (count: number) => void;
  playHand: () => void;
  discardCards: () => void;
  toggleCardSelection: (cardId: string) => void;
  buyJoker: (jokerId: number) => void;
  resetGame: () => void;
}

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (let s = 0; s < 4; s++) {
    for (let r = 0; r < 13; r++) {
      deck.push({
        id: `${s}-${r}`,
        suit: s as Suit,
        rank: r as Rank,
      });
    }
  }

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  deck: createDeck(),
  hand: [],
  playedCards: [],
  ownedJokers: [],
  shopJokers: [
    { id: 0, name: 'Joker', edition: Edition.BASE, value: 2, rarity: Rarity.COMMON },
    { id: 1, name: 'Greedy Joker', edition: Edition.BASE, value: 5, rarity: Rarity.COMMON },
  ],
  money: 4,
  score: 0,
  chips: 0,
  mult: 0,
  hands: 4,
  discards: 4,
  ante: 1,
  round: 1,
  currentBlind: 300,

  drawCards: (count: number) => {
    set((state) => {
      const newDeck = [...state.deck];
      const newCards = newDeck.splice(0, count);
      return {
        deck: newDeck,
        hand: [...state.hand, ...newCards],
      };
    });
  },

  playHand: () => {
    set((state) => {
      const selectedCards = state.playedCards;
      const handType = determineHandType(selectedCards);

      if (handType === HandType.NONE && selectedCards.length > 0) return state;

      let chips = 0;
      selectedCards.forEach((c) => (chips += getCardScoreValue(c.rank)));

      const jokerEffect = applyJokerEffects(state.ownedJokers, state);

      const finalChips = chips + (jokerEffect.chips || 0);
      const finalMult = 10 + (jokerEffect.mult || 0); // Base mult 10

      const newScore = state.score + finalChips * finalMult;

      return {
        score: newScore,
        hands: state.hands - 1,
        hand: state.hand.filter((c) => !state.playedCards.includes(c)),
        playedCards: [],
      };
    });
  },

  discardCards: () => {
    set((state) => ({
      discards: state.discards - 1,
      hand: state.hand.filter(c => !state.playedCards.includes(c)),
      playedCards: []
    }));
  },

  toggleCardSelection: (cardId: string) => {
    set((state) => {
      const card = state.hand.find(c => c.id === cardId);
      if (!card) return state;

      const isSelected = state.playedCards.includes(card);
      if (isSelected) {
        return { playedCards: state.playedCards.filter(c => c.id !== cardId) };
      } else if (state.playedCards.length < 5) {
        return { playedCards: [...state.playedCards, card] };
      }
      return state;
    });
  },

  buyJoker: (jokerId: number) => {
    set((state) => {
      const joker = state.shopJokers.find(j => j.id === jokerId);
      if (joker && state.money >= joker.value) {
        return {
          money: state.money - joker.value,
          ownedJokers: [...state.ownedJokers, joker],
          shopJokers: state.shopJokers.filter(j => j.id !== jokerId)
        };
      }
      return state;
    });
  },

  resetGame: () => {
    set({
      deck: createDeck(),
      hand: [],
      playedCards: [],
      ownedJokers: [],
      money: 4,
      score: 0,
      chips: 0,
      mult: 0,
      hands: 4,
      discards: 4,
      ante: 1,
      round: 1,
    });
  }
}));
