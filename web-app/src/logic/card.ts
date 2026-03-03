// Card suits
export const DIAMONDS = 0;
export const CLUBS = 1;
export const HEARTS = 2;
export const SPADES = 3;
export const NUM_SUITS = 4;

// Card ranks
export const TWO = 0;
export const THREE = 1;
export const FOUR = 2;
export const FIVE = 3;
export const SIX = 4;
export const SEVEN = 5;
export const EIGHT = 6;
export const NINE = 7;
export const TEN = 8;
export const JACK = 9;
export const QUEEN = 10;
export const KING = 11;
export const ACE = 12;
export const NUM_RANKS = 13;
export const RANK_OFFSET = 2; // Because the first rank is 2 and ranks start at 0

export const IMPOSSIBLY_HIGH_CARD_VALUE = 100;

export interface Card {
    suit: number;
    rank: number;
}

export interface CardObject {
    card: Card;
    selected: boolean;
}

export function createCard(suit: number, rank: number): Card {
    return { suit, rank };
}

export function createCardObject(card: Card): CardObject {
    return { card, selected: false };
}

export function cardGetValue(card: Card): number {
    if (card.rank === JACK || card.rank === QUEEN || card.rank === KING) {
        return 10; // Face cards are worth 10
    } else if (card.rank === ACE) {
        return 11; // Ace is worth 11
    } else {
        return card.rank + RANK_OFFSET; // 2-10 are worth their rank + RANK_OFFSET
    }
}