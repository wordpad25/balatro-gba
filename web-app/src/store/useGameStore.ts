import { create } from 'zustand';
import { GameState, Card, Joker, HandType, Suit, Rank, BlindType, JokerEvent, ScoringContext } from '../types/game';
import { analyzeHand, getBestHand } from '../logic/handAnalysis';
import { getBlindRequirement, getBlindReward } from '../logic/blinds';

interface GameStore {
  gameState: GameState;
  money: number;
  chips: number;
  mult: number;
  score: number;
  targetScore: number;
  ante: number;
  currentBlindType: BlindType;
  handsRemaining: number;
  discardsRemaining: number;
  hand: Card[];
  deck: Card[];
  jokers: Joker[];

  // Actions
  setGameState: (state: GameState) => void;
  selectBlind: (type: BlindType) => void;
  drawCard: () => void;
  discardHand: (selectedIds: string[]) => void;
  playHand: (selectedIds: string[]) => void;
  cashOut: () => void;
  resetGame: () => void;
}

const INITIAL_DECK: Card[] = [];
for (let s = 0; s < 4; s++) {
  for (let r = 0; r < 13; r++) {
    INITIAL_DECK.push({
      id: `${s}-${r}`,
      suit: s as Suit,
      rank: r as Rank,
    });
  }
}

const HAND_BASE_VALUES: Record<HandType, { chips: number, mult: number }> = {
  [HandType.NONE]: { chips: 0, mult: 0 },
  [HandType.HIGH_CARD]: { chips: 5, mult: 1 },
  [HandType.PAIR]: { chips: 10, mult: 2 },
  [HandType.TWO_PAIR]: { chips: 20, mult: 2 },
  [HandType.THREE_OF_A_KIND]: { chips: 30, mult: 3 },
  [HandType.STRAIGHT]: { chips: 30, mult: 4 },
  [HandType.FLUSH]: { chips: 35, mult: 4 },
  [HandType.FULL_HOUSE]: { chips: 40, mult: 4 },
  [HandType.FOUR_OF_A_KIND]: { chips: 60, mult: 7 },
  [HandType.STRAIGHT_FLUSH]: { chips: 100, mult: 8 },
  [HandType.ROYAL_FLUSH]: { chips: 100, mult: 8 },
  [HandType.FIVE_OF_A_KIND]: { chips: 120, mult: 12 },
  [HandType.FLUSH_HOUSE]: { chips: 140, mult: 14 },
  [HandType.FLUSH_FIVE]: { chips: 160, mult: 16 },
};

function getCardScoringValue(rank: Rank): number {
  if (rank === Rank.ACE) return 11;
  if (rank >= Rank.TEN) return 10;
  return rank + 2;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: GameState.MAIN_MENU,
  money: 4,
  chips: 0,
  mult: 0,
  score: 0,
  targetScore: 300,
  ante: 1,
  currentBlindType: BlindType.SMALL,
  handsRemaining: 4,
  discardsRemaining: 4,
  hand: [],
  deck: [...INITIAL_DECK].sort(() => Math.random() - 0.5),
  jokers: [],

  setGameState: (state) => set({ gameState: state }),

  selectBlind: (type) => {
    const { ante } = get();
    set({
      currentBlindType: type,
      targetScore: getBlindRequirement(type, ante),
      gameState: GameState.PLAYING,
      score: 0,
      handsRemaining: 4,
      discardsRemaining: 4,
      hand: [],
      deck: [...INITIAL_DECK].sort(() => Math.random() - 0.5)
    });
  },

  drawCard: () => {
    const { deck, hand } = get();
    if (deck.length === 0 || hand.length >= 8) return;
    const newDeck = [...deck];
    const newCard = newDeck.pop()!;
    set({ deck: newDeck, hand: [...hand, newCard] });
  },

  discardHand: (selectedIds) => {
    const { hand, discardsRemaining } = get();
    if (discardsRemaining <= 0) return;
    const newHand = hand.filter(card => !selectedIds.includes(card.id));

    // Draw back up to 8
    const { deck } = get();
    let updatedHand = [...newHand];
    let updatedDeck = [...deck];
    while (updatedHand.length < 8 && updatedDeck.length > 0) {
      updatedHand.push(updatedDeck.pop()!);
    }

    set({
      hand: updatedHand,
      deck: updatedDeck,
      discardsRemaining: discardsRemaining - 1
    });
  },

  playHand: (selectedIds) => {
    const state = get();
    if (state.handsRemaining <= 0) return;

    const selectedCards = state.hand.filter(card => selectedIds.includes(card.id));
    const analysis = analyzeHand(selectedCards);
    const bestHand = getBestHand(analysis);
    const baseValues = HAND_BASE_VALUES[bestHand];

    // Scoring Context
    const baseCtx: Omit<ScoringContext, 'event' | 'card'> = {
      playedCards: selectedCards,
      handCards: state.hand,
      gameState: { containedHands: analysis }
    };

    let finalChips = baseValues.chips;
    let finalMult = baseValues.mult;

    // 1. Individual Card Scored
    selectedCards.forEach(card => {
      finalChips += getCardScoringValue(card.rank);

      state.jokers.forEach(joker => {
        const effect = joker.effect({ ...baseCtx, event: JokerEvent.ON_CARD_SCORED, card });
        if (effect.chips) finalChips += effect.chips;
        if (effect.mult) finalMult += effect.mult;
      });
    });

    // 2. Independent Joker Effects
    state.jokers.forEach(joker => {
      const effect = joker.effect({ ...baseCtx, event: JokerEvent.INDEPENDENT });
      if (effect.chips) finalChips += effect.chips;
      if (effect.mult) finalMult += effect.mult;
      if (effect.xmult) finalMult *= effect.xmult;
    });

    const handScore = finalChips * finalMult;
    const newScore = state.score + handScore;
    const newHand = state.hand.filter(card => !selectedIds.includes(card.id));

    // Draw back up to 8
    let updatedHand = [...newHand];
    let updatedDeck = [...state.deck];
    while (updatedHand.length < 8 && updatedDeck.length > 0) {
      updatedHand.push(updatedDeck.pop()!);
    }

    set({
      score: newScore,
      handsRemaining: state.handsRemaining - 1,
      hand: updatedHand,
      deck: updatedDeck
    });

    if (newScore >= state.targetScore) {
      setTimeout(() => set({ gameState: GameState.ROUND_END }), 500);
    } else if (state.handsRemaining <= 1) {
      setTimeout(() => set({ gameState: GameState.LOSE }), 500);
    }
  },

  cashOut: () => {
    const { money, currentBlindType, handsRemaining, ante } = get();
    const reward = getBlindReward(currentBlindType);
    const interest = Math.min(5, Math.floor(money / 5));
    const nextAnte = currentBlindType === BlindType.BOSS ? ante + 1 : ante;

    set({
      money: money + reward + handsRemaining + interest,
      ante: nextAnte,
      gameState: GameState.SHOP
    });
  },

  resetGame: () => set({
    money: 4,
    chips: 0,
    mult: 0,
    score: 0,
    targetScore: 300,
    ante: 1,
    currentBlindType: BlindType.SMALL,
    handsRemaining: 4,
    discardsRemaining: 4,
    hand: [],
    deck: [...INITIAL_DECK].sort(() => Math.random() - 0.5),
    jokers: [],
  })
}));
