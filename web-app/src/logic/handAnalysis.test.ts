import { describe, it, expect } from 'vitest';
import { analyzeHand, getBestHand } from '../logic/handAnalysis';
import { Rank, Suit, HandType } from '../types/game';

describe('Hand Analysis Logic', () => {
  it('identifies a Pair', () => {
    const hand = [
      { id: '1', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '2', suit: Suit.DIAMONDS, rank: Rank.ACE },
      { id: '3', suit: Suit.HEARTS, rank: Rank.TWO },
    ];
    const analysis = analyzeHand(hand);
    expect(analysis.PAIR).toBe(true);
    expect(getBestHand(analysis)).toBe(HandType.PAIR);
  });

  it('identifies a Flush', () => {
    const hand = [
      { id: '1', suit: Suit.SPADES, rank: Rank.TWO },
      { id: '2', suit: Suit.SPADES, rank: Rank.FOUR },
      { id: '3', suit: Suit.SPADES, rank: Rank.SIX },
      { id: '4', suit: Suit.SPADES, rank: Rank.EIGHT },
      { id: '5', suit: Suit.SPADES, rank: Rank.TEN },
    ];
    const analysis = analyzeHand(hand);
    expect(analysis.FLUSH).toBe(true);
    expect(getBestHand(analysis)).toBe(HandType.FLUSH);
  });

  it('identifies a Full House', () => {
    const hand = [
      { id: '1', suit: Suit.CLUBS, rank: Rank.KING },
      { id: '2', suit: Suit.DIAMONDS, rank: Rank.KING },
      { id: '3', suit: Suit.HEARTS, rank: Rank.KING },
      { id: '4', suit: Suit.SPADES, rank: Rank.TWO },
      { id: '5', suit: Suit.CLUBS, rank: Rank.TWO },
    ];
    const analysis = analyzeHand(hand);
    expect(analysis.FULL_HOUSE).toBe(true);
    expect(getBestHand(analysis)).toBe(HandType.FULL_HOUSE);
  });

  it('identifies a Straight', () => {
    const hand = [
      { id: '1', suit: Suit.CLUBS, rank: Rank.TWO },
      { id: '2', suit: Suit.DIAMONDS, rank: Rank.THREE },
      { id: '3', suit: Suit.HEARTS, rank: Rank.FOUR },
      { id: '4', suit: Suit.SPADES, rank: Rank.FIVE },
      { id: '5', suit: Suit.CLUBS, rank: Rank.SIX },
    ];
    const analysis = analyzeHand(hand);
    expect(analysis.STRAIGHT).toBe(true);
    expect(getBestHand(analysis)).toBe(HandType.STRAIGHT);
  });

  it('identifies an Ace-low Straight', () => {
    const hand = [
      { id: '1', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '2', suit: Suit.DIAMONDS, rank: Rank.TWO },
      { id: '3', suit: Suit.HEARTS, rank: Rank.THREE },
      { id: '4', suit: Suit.SPADES, rank: Rank.FOUR },
      { id: '5', suit: Suit.CLUBS, rank: Rank.FIVE },
    ];
    const analysis = analyzeHand(hand);
    expect(analysis.STRAIGHT).toBe(true);
    expect(getBestHand(analysis)).toBe(HandType.STRAIGHT);
  });
});
