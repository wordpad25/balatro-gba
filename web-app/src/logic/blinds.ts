import { Blind, BlindType } from '../types/game';

const ANTE_LUT = [100, 300, 800, 2000, 5000, 11000, 20000, 35000, 50000];

export const BLIND_INFO: Record<BlindType, { name: string, multiplier: number, reward: number }> = {
  [BlindType.SMALL]: { name: 'Small Blind', multiplier: 1.0, reward: 3 },
  [BlindType.BIG]: { name: 'Big Blind', multiplier: 1.5, reward: 4 },
  [BlindType.BOSS]: { name: 'Boss Blind', multiplier: 2.0, reward: 5 },
};

export function getBlindRequirement(type: BlindType, ante: number): number {
  const safeAnte = Math.max(0, Math.min(ante, ANTE_LUT.length - 1));
  const base = ANTE_LUT[safeAnte];
  const multi = BLIND_INFO[type].multiplier;
  return Math.floor(base * multi);
}

export function getBlindReward(type: BlindType): number {
  return BLIND_INFO[type].reward;
}
