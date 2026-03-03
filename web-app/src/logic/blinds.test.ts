import { describe, it, expect } from 'vitest';
import { getBlindRequirement, getBlindReward } from '../logic/blinds';
import { BlindType } from '../types/game';

describe('Blind Logic', () => {
  it('calculates correct requirements for Small Blind', () => {
    expect(getBlindRequirement(BlindType.SMALL, 1)).toBe(300);
    expect(getBlindRequirement(BlindType.SMALL, 2)).toBe(800);
    expect(getBlindRequirement(BlindType.SMALL, 0)).toBe(100);
  });

  it('calculates correct requirements for Big Blind', () => {
    expect(getBlindRequirement(BlindType.BIG, 1)).toBe(450);
    expect(getBlindRequirement(BlindType.BIG, 2)).toBe(1200);
  });

  it('calculates correct requirements for Boss Blind', () => {
    expect(getBlindRequirement(BlindType.BOSS, 1)).toBe(600);
    expect(getBlindRequirement(BlindType.BOSS, 2)).toBe(1600);
  });

  it('returns correct rewards', () => {
    expect(getBlindReward(BlindType.SMALL)).toBe(3);
    expect(getBlindReward(BlindType.BIG)).toBe(4);
    expect(getBlindReward(BlindType.BOSS)).toBe(5);
  });
});
