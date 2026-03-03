import { create } from 'zustand';
import { GameState, Card, Joker, HandType, Suit, Rank } from '../types/game';
import { analyzeHand, getBestHand } from '../logic/handAnalysis';

interface GameStore {
  gameState: GameState;
  money: number;
  chips: number;
  mult: number;
  score: number;
  targetScore: number;
  handsRemaining: number;
  discardsRemaining: number;
  hand: Card[];
  deck: Card[];
  jokers: Joker[];

  // Actions
  setGameState: (state: GameState) => void;
  drawCard: () => void;
  discardHand: (selectedIds: string[]) => void;
  playHand: (selectedIds: string[]) => void;
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
  handsRemaining: 4,
  discardsRemaining: 4,
  hand: [],
  deck: [...INITIAL_DECK].sort(() => Math.random() - 0.5),
  jokers: [],

  setGameState: (state) => set({ gameState: state }),

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
    set({
      hand: newHand,
      discardsRemaining: discardsRemaining - 1
    });
    // Draw back up to 8
    const currentStore = get();
    let updatedHand = [...currentStore.hand];
    let updatedDeck = [...currentStore.deck];
    while (updatedHand.length < 8 && updatedDeck.length > 0) {
      updatedHand.push(updatedDeck.pop()!);
    }
    set({ hand: updatedHand, deck: updatedDeck });
  },

  playHand: (selectedIds) => {
    const { hand, handsRemaining, score, targetScore } = get();
    if (handsRemaining <= 0) return;

    const selectedCards = hand.filter(card => selectedIds.includes(card.id));
    const analysis = analyzeHand(selectedCards);
    const bestHand = getBestHand(analysis);
    const baseValues = HAND_BASE_VALUES[bestHand];

    const cardChips = selectedCards.reduce((sum, card) => sum + getCardScoringValue(card.rank), 0);
    const finalChips = baseValues.chips + cardChips;
    const finalMult = baseValues.mult;
    const handScore = finalChips * finalMult;

    const newScore = score + handScore;
    const newHand = hand.filter(card => !selectedIds.includes(card.id));

    set({
      score: newScore,
      handsRemaining: handsRemaining - 1,
      hand: newHand
    });

    if (newScore >= targetScore) {
      setTimeout(() => set({ gameState: GameState.ROUND_END }), 500);
    } else if (handsRemaining <= 1) {
      setTimeout(() => set({ gameState: GameState.LOSE }), 500);
    }

    // Draw back up to 8
    const currentStore = get();
    let updatedHand = [...currentStore.hand];
    let updatedDeck = [...currentStore.deck];
    while (updatedHand.length < 8 && updatedDeck.length > 0) {
      updatedHand.push(updatedDeck.pop()!);
    }
    set({ hand: updatedHand, deck: updatedDeck });
  },

  resetGame: () => set({
    money: 4,
    chips: 0,
    mult: 0,
    score: 0,
    handsRemaining: 4,
    discardsRemaining: 4,
    hand: [],
    deck: [...INITIAL_DECK].sort(() => Math.random() - 0.5),
    jokers: [],
  })
}));
