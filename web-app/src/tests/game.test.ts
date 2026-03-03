import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/useGameStore';
import { GameState, HandState } from '../logic/game';

describe('Game Store Logic', () => {
    beforeEach(() => {
        useGameStore.setState({
            deck: [], hand: [], discard_pile: [], played: [],
            score: 0, chips: 0, mult: 0, money: 4, hands: 4, discards: 4,
            ante: 1, round: 1,
            game_state: GameState.GAME_STATE_MAIN_MENU,
            hand_state: HandState.HAND_DRAW
        });
    });

    it('initializes game correctly', () => {
        useGameStore.getState().game_init();
        const state = useGameStore.getState();

        expect(state.deck.length).toBe(52 - state.hand_size);
        expect(state.hand.length).toBe(state.hand_size);
        expect(state.game_state).toBe(GameState.GAME_STATE_PLAYING);
        expect(state.hand_state).toBe(HandState.HAND_SELECT);
    });

    it('discards selected cards', () => {
        useGameStore.getState().game_init();

        // Select first two cards
        useGameStore.getState().hand_select_card(0);
        useGameStore.getState().hand_select_card(1);

        useGameStore.getState().game_playing_execute_discard();

        const state = useGameStore.getState();
        expect(state.discards).toBe(3);
        expect(state.discard_pile.length).toBe(2);
        expect(state.hand.length).toBe(state.hand_size); // Drew 2 new cards
    });
});