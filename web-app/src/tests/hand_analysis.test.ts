import { describe, it, expect } from 'vitest';
import { compute_contained_hand_types, compute_hand_type, HandType } from '../logic/game';
import { NUM_RANKS, NUM_SUITS } from '../logic/card';

function getHandTypeForCards(cards: {suit: number, rank: number}[]): HandType {
    const ranks = Array(NUM_RANKS).fill(0);
    const suits = Array(NUM_SUITS).fill(0);

    for (const c of cards) {
        ranks[c.rank]++;
        suits[c.suit]++;
    }

    const contained = compute_contained_hand_types(ranks, suits, false, 5);
    return compute_hand_type(contained);
}

describe('Hand Analysis Logic', () => {
    it('detects a Pair', () => {
        const type = getHandTypeForCards([
            {suit: 0, rank: 0},
            {suit: 1, rank: 0},
            {suit: 0, rank: 1},
            {suit: 0, rank: 2},
            {suit: 0, rank: 3}
        ]);
        expect(type).toBe(HandType.PAIR);
    });

    it('detects a Flush', () => {
        const type = getHandTypeForCards([
            {suit: 0, rank: 0},
            {suit: 0, rank: 2},
            {suit: 0, rank: 4},
            {suit: 0, rank: 6},
            {suit: 0, rank: 8}
        ]);
        expect(type).toBe(HandType.FLUSH);
    });

    it('detects a Straight', () => {
        const type = getHandTypeForCards([
            {suit: 0, rank: 0},
            {suit: 1, rank: 1},
            {suit: 2, rank: 2},
            {suit: 3, rank: 3},
            {suit: 0, rank: 4}
        ]);
        expect(type).toBe(HandType.STRAIGHT);
    });
});