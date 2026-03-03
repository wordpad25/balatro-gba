import { describe, it, expect } from 'vitest';
import { createJoker } from '../logic/jokers';
import { JokerEvent, Suit, Rank } from '../types/game';

describe('Joker Logic', () => {
  it('identifies the Default Joker effect', () => {
    const joker = createJoker(0);
    const ctx = {
      event: JokerEvent.INDEPENDENT,
      playedCards: [],
      handCards: [],
      gameState: {}
    };
    const effect = joker.effect(ctx);
    expect(effect.mult).toBe(4);
  });

  it('identifies Sinful Joker effects', () => {
    const greedy = createJoker(1); // Diamonds
    const ctx = {
      event: JokerEvent.ON_CARD_SCORED,
      card: { id: 'test', suit: Suit.DIAMONDS, rank: Rank.ACE },
      playedCards: [],
      handCards: [],
      gameState: {}
    };
    expect(greedy.effect(ctx).mult).toBe(3);

    const mismatchCtx = { ...ctx, card: { ...ctx.card, suit: Suit.CLUBS } };
    expect(greedy.effect(mismatchCtx).mult).toBeUndefined();
  });

  it('identifies Jolly Joker effect', () => {
    const jolly = createJoker(5);
    const ctx = {
      event: JokerEvent.INDEPENDENT,
      playedCards: [],
      handCards: [],
      gameState: { containedHands: { PAIR: true } }
    };
    expect(jolly.effect(ctx).mult).toBe(8);

    const failCtx = { ...ctx, gameState: { containedHands: { PAIR: false } } };
    expect(jolly.effect(failCtx).mult).toBeUndefined();
  });

  it('identifies Half Joker effect', () => {
    const half = createJoker(15);
    const ctx = {
      event: JokerEvent.INDEPENDENT,
      playedCards: [{}, {}, {}], // 3 cards
      handCards: [],
      gameState: {}
    };
    // @ts-ignore - simplified cards for test
    expect(half.effect(ctx).mult).toBe(20);

    const failCtx = { ...ctx, playedCards: [{}, {}, {}, {}] }; // 4 cards
    // @ts-ignore
    expect(half.effect(failCtx).mult).toBeUndefined();
  });
});
