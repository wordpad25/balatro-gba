import { Suit, Rank, HandType, Card } from '../types/game';

export function getHandDistribution(cards: Card[]) {
  const ranks = new Array(13).fill(0);
  const suits = new Array(4).fill(0);

  for (const card of cards) {
    ranks[card.rank]++;
    suits[card.suit]++;
  }

  return { ranks, suits };
}

export function getHighestNOfAKind(ranks: number[]) {
  return Math.max(...ranks);
}

export function hasTwoPair(ranks: number[]) {
  let pairs = 0;
  for (const count of ranks) {
    if (count >= 2) pairs++;
  }
  return pairs >= 2;
}

export function hasFullHouse(ranks: number[]) {
  let hasThree = false;
  let hasTwo = false;
  let threeCount = 0;

  for (const count of ranks) {
    if (count >= 3) {
      if (hasThree) hasTwo = true;
      hasThree = true;
      threeCount++;
    } else if (count >= 2) {
      hasTwo = true;
    }
  }

  return (threeCount >= 2) || (hasThree && hasTwo);
}

export function hasStraight(ranks: number[]) {
  let run = 0;
  for (let i = 0; i < 13; i++) {
    if (ranks[i] > 0) {
      run++;
      if (run >= 5) return true;
    } else {
      run = 0;
    }
  }

  // Ace low straight (A, 2, 3, 4, 5)
  if (ranks[Rank.ACE] > 0 &&
      ranks[Rank.TWO] > 0 &&
      ranks[Rank.THREE] > 0 &&
      ranks[Rank.FOUR] > 0 &&
      ranks[Rank.FIVE] > 0) {
    return true;
  }

  return false;
}

export function hasFlush(suits: number[]) {
  return suits.some(count => count >= 5);
}

export function determineHandType(cards: Card[]): HandType {
  const { ranks, suits } = getHandDistribution(cards);

  const isFlush = hasFlush(suits);
  const isStraight = hasStraight(ranks);
  const nOfAKind = getHighestNOfAKind(ranks);

  if (isFlush && isStraight) {
    if (ranks[Rank.TEN] && ranks[Rank.ACE]) return HandType.ROYAL_FLUSH;
    return HandType.STRAIGHT_FLUSH;
  }

  if (nOfAKind >= 5) return HandType.FIVE_OF_A_KIND;
  if (nOfAKind === 4) return HandType.FOUR_OF_A_KIND;
  if (hasFullHouse(ranks)) return HandType.FULL_HOUSE;
  if (isFlush) return HandType.FLUSH;
  if (isStraight) return HandType.STRAIGHT;
  if (nOfAKind === 3) return HandType.THREE_OF_A_KIND;
  if (hasTwoPair(ranks)) return HandType.TWO_PAIR;
  if (nOfAKind === 2) return HandType.PAIR;

  return HandType.HIGH_CARD;
}

export function getCardScoreValue(rank: Rank): number {
  if (rank >= Rank.TEN) return 10;
  if (rank === Rank.ACE) return 11;
  return rank + 2;
}
