import { Joker, GameState } from '../types/game';

export interface JokerEffect {
  chips?: number;
  mult?: number;
  money?: number;
}

export function applyJokerEffects(jokers: Joker[], state: GameState): JokerEffect {
  const effect: JokerEffect = { chips: 0, mult: 0, money: 0 };

  for (const joker of jokers) {
    switch (joker.name) {
      case 'Joker':
        effect.mult! += 4;
        break;
      case 'Greedy Joker':
        // Simplified: adds 20 chips
        effect.chips! += 20;
        break;
    }
  }

  return effect;
}
