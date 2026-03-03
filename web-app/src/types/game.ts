export enum Suit {
  HEARTS = 0,
  DIAMONDS = 1,
  CLUBS = 2,
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

export enum Edition {
  BASE = 0,
  FOIL = 1,
  HOLO = 2,
  POLY = 3,
  NEGATIVE = 4
}

export enum Rarity {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  LEGENDARY = 3
}

export interface Joker {
  id: number;
  name: string;
  edition: Edition;
  value: number;
  rarity: Rarity;
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

export interface GameState {
  deck: Card[];
  hand: Card[];
  playedCards: Card[];
  ownedJokers: Joker[];
  shopJokers: Joker[];
  money: number;
  score: number;
  chips: number;
  mult: number;
  hands: number;
  discards: number;
  ante: number;
  round: number;
  currentBlind: number;
}
