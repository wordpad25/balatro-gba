import { Card, Rank, Suit, HandType, ContainedHandTypes } from '../types/game';

export function getRankCounts(cards: Card[]): number[] {
  const counts = new Array(13).fill(0);
  cards.forEach(card => counts[card.rank]++);
  return counts;
}

export function getSuitCounts(cards: Card[]): number[] {
  const counts = new Array(4).fill(0);
  cards.forEach(card => counts[card.suit]++);
  return counts;
}

export function hasNOfAKind(rankCounts: number[]): number {
  return Math.max(...rankCounts);
}

export function hasTwoPair(rankCounts: number[]): boolean {
  let pairs = 0;
  for (const count of rankCounts) {
    if (count >= 2) pairs++;
  }
  return pairs >= 2;
}

export function hasFullHouse(rankCounts: number[]): boolean {
  let hasThree = false;
  let hasTwo = false;
  let threes = 0;

  for (const count of rankCounts) {
    if (count >= 3) {
      if (hasThree) hasTwo = true; // Second three-of-a-kind counts as a pair
      hasThree = true;
      threes++;
    } else if (count >= 2) {
      hasTwo = true;
    }
  }
  return (hasThree && hasTwo) || threes >= 2;
}

export function hasStraight(rankCounts: number[], straightSize: number = 5): boolean {
  let run = 0;
  for (let i = 0; i < 13; i++) {
    if (rankCounts[i] > 0) {
      run++;
      if (run >= straightSize) return true;
    } else {
      run = 0;
    }
  }

  // Ace-low straight
  if (straightSize >= 2 && rankCounts[Rank.ACE] > 0) {
    let ok = true;
    for (let i = 0; i < straightSize - 1; i++) {
      if (rankCounts[i] === 0) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }

  return false;
}

export function hasFlush(suitCounts: number[], flushSize: number = 5): boolean {
  return suitCounts.some(count => count >= flushSize);
}

export function analyzeHand(cards: Card[], straightFlushSize: number = 5): ContainedHandTypes {
  const rankCounts = getRankCounts(cards);
  const suitCounts = getSuitCounts(cards);
  const nOfAKind = hasNOfAKind(rankCounts);

  const isStraight = hasStraight(rankCounts, straightFlushSize);
  const isFlush = hasFlush(suitCounts, straightFlushSize);

  const analysis: ContainedHandTypes = {
    HIGH_CARD: cards.length > 0,
    PAIR: nOfAKind >= 2,
    TWO_PAIR: hasTwoPair(rankCounts),
    THREE_OF_A_KIND: nOfAKind >= 3,
    STRAIGHT: isStraight,
    FLUSH: isFlush,
    FULL_HOUSE: hasFullHouse(rankCounts),
    FOUR_OF_A_KIND: nOfAKind >= 4,
    STRAIGHT_FLUSH: isStraight && isFlush,
    ROYAL_FLUSH: false,
    FIVE_OF_A_KIND: nOfAKind >= 5,
    FLUSH_HOUSE: isFlush && hasFullHouse(rankCounts),
    FLUSH_FIVE: isFlush && nOfAKind >= 5
  };

  if (analysis.STRAIGHT_FLUSH) {
    const hasRoyal = rankCounts[Rank.TEN] > 0 &&
                     rankCounts[Rank.JACK] > 0 &&
                     rankCounts[Rank.QUEEN] > 0 &&
                     rankCounts[Rank.KING] > 0 &&
                     rankCounts[Rank.ACE] > 0;
    analysis.ROYAL_FLUSH = hasRoyal;
  }

  return analysis;
}

export function getBestHand(analysis: ContainedHandTypes): HandType {
  if (analysis.FLUSH_FIVE) return HandType.FLUSH_FIVE;
  if (analysis.FLUSH_HOUSE) return HandType.FLUSH_HOUSE;
  if (analysis.FIVE_OF_A_KIND) return HandType.FIVE_OF_A_KIND;
  if (analysis.ROYAL_FLUSH) return HandType.ROYAL_FLUSH;
  if (analysis.STRAIGHT_FLUSH) return HandType.STRAIGHT_FLUSH;
  if (analysis.FOUR_OF_A_KIND) return HandType.FOUR_OF_A_KIND;
  if (analysis.FULL_HOUSE) return HandType.FULL_HOUSE;
  if (analysis.FLUSH) return HandType.FLUSH;
  if (analysis.STRAIGHT) return HandType.STRAIGHT;
  if (analysis.THREE_OF_A_KIND) return HandType.THREE_OF_A_KIND;
  if (analysis.TWO_PAIR) return HandType.TWO_PAIR;
  if (analysis.PAIR) return HandType.PAIR;
  if (analysis.HIGH_CARD) return HandType.HIGH_CARD;
  return HandType.NONE;
}
