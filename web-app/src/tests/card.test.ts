import { describe, it, expect } from 'vitest';
import { createCard, cardGetValue } from '../logic/card';

describe('Card Logic', () => {
    it('should correctly evaluate card values', () => {
        expect(cardGetValue(createCard(0, 0))).toBe(2); // TWO
        expect(cardGetValue(createCard(0, 8))).toBe(10); // TEN
        expect(cardGetValue(createCard(0, 9))).toBe(10); // JACK
        expect(cardGetValue(createCard(0, 10))).toBe(10); // QUEEN
        expect(cardGetValue(createCard(0, 11))).toBe(10); // KING
        expect(cardGetValue(createCard(0, 12))).toBe(11); // ACE
    });
});