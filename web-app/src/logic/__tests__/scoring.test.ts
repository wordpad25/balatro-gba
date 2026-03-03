import { describe, it, expect } from 'vitest';
import { determineHandType } from '../scoring';
import { Suit, Rank, HandType } from '../../types/game';

describe('Scoring Logic', () => {
  it('identifies High Card', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.TWO },
      { id: '2', suit: Suit.CLUBS, rank: Rank.FOUR },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.SIX },
      { id: '4', suit: Suit.SPADES, rank: Rank.EIGHT },
      { id: '5', suit: Suit.HEARTS, rank: Rank.TEN },
    ];
    expect(determineHandType(hand)).toBe(HandType.HIGH_CARD);
  });

  it('identifies a Pair', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.ACE },
      { id: '2', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.KING },
      { id: '4', suit: Suit.SPADES, rank: Rank.QUEEN },
      { id: '5', suit: Suit.HEARTS, rank: Rank.JACK },
    ];
    expect(determineHandType(hand)).toBe(HandType.PAIR);
  });

  it('identifies Two Pair', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.ACE },
      { id: '2', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.KING },
      { id: '4', suit: Suit.SPADES, rank: Rank.KING },
      { id: '5', suit: Suit.HEARTS, rank: Rank.QUEEN },
    ];
    expect(determineHandType(hand)).toBe(HandType.TWO_PAIR);
  });

  it('identifies Three of a Kind', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.ACE },
      { id: '2', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.ACE },
      { id: '4', suit: Suit.SPADES, rank: Rank.KING },
      { id: '5', suit: Suit.HEARTS, rank: Rank.QUEEN },
    ];
    expect(determineHandType(hand)).toBe(HandType.THREE_OF_A_KIND);
  });

  it('identifies a Straight', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.TWO },
      { id: '2', suit: Suit.CLUBS, rank: Rank.THREE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.FOUR },
      { id: '4', suit: Suit.SPADES, rank: Rank.FIVE },
      { id: '5', suit: Suit.HEARTS, rank: Rank.SIX },
    ];
    expect(determineHandType(hand)).toBe(HandType.STRAIGHT);
  });

  it('identifies a Flush', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.TWO },
      { id: '2', suit: Suit.HEARTS, rank: Rank.FOUR },
      { id: '3', suit: Suit.HEARTS, rank: Rank.SIX },
      { id: '4', suit: Suit.HEARTS, rank: Rank.EIGHT },
      { id: '5', suit: Suit.HEARTS, rank: Rank.TEN },
    ];
    expect(determineHandType(hand)).toBe(HandType.FLUSH);
  });

  it('identifies a Full House', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.ACE },
      { id: '2', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.ACE },
      { id: '4', suit: Suit.SPADES, rank: Rank.KING },
      { id: '5', suit: Suit.HEARTS, rank: Rank.KING },
    ];
    expect(determineHandType(hand)).toBe(HandType.FULL_HOUSE);
  });

  it('identifies Four of a Kind', () => {
    const hand = [
      { id: '1', suit: Suit.HEARTS, rank: Rank.ACE },
      { id: '2', suit: Suit.CLUBS, rank: Rank.ACE },
      { id: '3', suit: Suit.DIAMONDS, rank: Rank.ACE },
      { id: '4', suit: Suit.SPADES, rank: Rank.ACE },
      { id: '5', suit: Suit.HEARTS, rank: Rank.KING },
    ];
    expect(determineHandType(hand)).toBe(HandType.FOUR_OF_A_KIND);
  });
});
