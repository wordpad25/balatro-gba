export enum Suit {
  DIAMONDS = 0,
  CLUBS = 1,
  HEARTS = 2,
  SPADES = 3
}

export enum Rank {
  TWO = 0,
  THREE = 1,
  FOUR = 2,
  FIVE = 3,
  SIX = 4,
  SEVEN = 5,
  EIGHT = 6,
  NINE = 7,
  TEN = 8,
  JACK = 9,
  QUEEN = 10,
  KING = 11,
  ACE = 12
}

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export enum HandType {
  NONE = 0,
  HIGH_CARD = 1,
  PAIR = 2,
  TWO_PAIR = 3,
  THREE_OF_A_KIND = 4,
  STRAIGHT = 5,
  FLUSH = 6,
  FULL_HOUSE = 7,
  FOUR_OF_A_KIND = 8,
  STRAIGHT_FLUSH = 9,
  ROYAL_FLUSH = 10,
  FIVE_OF_A_KIND = 11,
  FLUSH_HOUSE = 12,
  FLUSH_FIVE = 13
}

export interface ContainedHandTypes {
  HIGH_CARD: boolean;
  PAIR: boolean;
  TWO_PAIR: boolean;
  THREE_OF_A_KIND: boolean;
  STRAIGHT: boolean;
  FLUSH: boolean;
  FULL_HOUSE: boolean;
  FOUR_OF_A_KIND: boolean;
  STRAIGHT_FLUSH: boolean;
  ROYAL_FLUSH: boolean;
  FIVE_OF_A_KIND: boolean;
  FLUSH_HOUSE: boolean;
  FLUSH_FIVE: boolean;
}

export enum GameState {
  MAIN_MENU,
  BLIND_SELECT,
  PLAYING,
  ROUND_END,
  SHOP,
  WIN,
  LOSE
}

export enum BlindType {
  SMALL = 0,
  BIG = 1,
  BOSS = 2
}

export interface Blind {
  type: BlindType;
  name: string;
  multiplier: number;
  reward: number;
}

export interface Joker {
  id: number;
  name: string;
  rarity: number;
  value: number;
  effect: (context: ScoringContext) => JokerEffect;
}

export interface JokerEffect {
  chips?: number;
  mult?: number;
  xmult?: number;
  money?: number;
  retrigger?: boolean;
  expire?: boolean;
  message?: string;
}

export interface ScoringContext {
  event: JokerEvent;
  card?: Card;
  playedCards: Card[];
  handCards: Card[];
  gameState: any; // Will be more specific
}

export enum JokerEvent {
  ON_JOKER_CREATED,
  ON_HAND_PLAYED,
  ON_CARD_SCORED,
  ON_CARD_SCORED_END,
  ON_CARD_HELD,
  INDEPENDENT,
  ON_HAND_SCORED_END,
  ON_HAND_DISCARDED,
  ON_ROUND_END,
  ON_BLIND_SELECTED,
}
