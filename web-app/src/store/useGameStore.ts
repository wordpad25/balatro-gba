import { create } from 'zustand';
import type { Card, CardObject } from '../logic/card';
import { createCard, createCardObject, NUM_SUITS, NUM_RANKS } from '../logic/card';
import { GameState, HandState, PlayState, HandType, compute_contained_hand_types, compute_hand_type, hand_base_values } from '../logic/game';
import { BlindType, BlindState, blind_get_requirement } from '../logic/blind';

export interface JokerObject {
    id: number;
    // mock joker object for the store
}

export interface GameStoreState {
    deck: Card[];
    hand: CardObject[];
    discard_pile: Card[];
    played: CardObject[];
    _owned_jokers_list: JokerObject[];

    chips: number;
    mult: number;
    score: number;
    money: number;
    hands: number;
    discards: number;
    ante: number;
    round: number;

    game_state: GameState;
    hand_state: HandState;
    play_state: PlayState;
    hand_type: HandType;

    current_blind: BlindType;
    blinds_states: BlindState[];

    max_hands: number;
    max_discards: number;
    hand_size: number;

    // Actions
    game_init: () => void;
    card_draw: () => void;
    game_playing_execute_discard: () => void;
    game_playing_execute_play_hand: () => void;
    hand_select_card: (index: number) => void;
    sort_hand_by_suit: () => void;
    sort_hand_by_rank: () => void;
    score_played_hand: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
    deck: [],
    hand: [],
    discard_pile: [],
    played: [],
    _owned_jokers_list: [],

    chips: 0,
    mult: 0,
    score: 0,
    money: 4,
    hands: 4,
    discards: 4,
    ante: 1,
    round: 1,

    game_state: GameState.GAME_STATE_MAIN_MENU,
    hand_state: HandState.HAND_DRAW,
    play_state: PlayState.PLAY_STARTING,
    hand_type: HandType.NONE,

    current_blind: BlindType.BLIND_TYPE_SMALL,
    blinds_states: [BlindState.BLIND_STATE_CURRENT, BlindState.BLIND_STATE_UPCOMING, BlindState.BLIND_STATE_UPCOMING],

    max_hands: 4,
    max_discards: 4,
    hand_size: 8,

    game_init: () => {
        set((state) => {
            let newDeck: Card[] = [];
            for (let suit = 0; suit < NUM_SUITS; suit++) {
                for (let rank = 0; rank < NUM_RANKS; rank++) {
                    newDeck.push(createCard(suit, rank));
                }
            }
            // Shuffle
            for (let i = newDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
            }

            return {
                deck: newDeck,
                hand: [],
                discard_pile: [],
                played: [],
                _owned_jokers_list: [],
                chips: 0,
                mult: 0,
                score: 0,
                money: 4,
                hands: state.max_hands,
                discards: state.max_discards,
                ante: 1,
                round: 1,
                game_state: GameState.GAME_STATE_PLAYING,
                hand_state: HandState.HAND_DRAW,
                current_blind: BlindType.BLIND_TYPE_SMALL,
            };
        });

        // auto draw
        for (let i = 0; i < get().hand_size; i++) {
            get().card_draw();
        }
        set({ hand_state: HandState.HAND_SELECT });
    },

    card_draw: () => {
        set((state) => {
            if (state.deck.length === 0 || state.hand.length >= state.hand_size) return {};
            const newDeck = [...state.deck];
            const card = newDeck.pop();
            if (!card) return {};
            const newHand = [...state.hand, createCardObject(card)];
            return { deck: newDeck, hand: newHand };
        });
    },

    game_playing_execute_discard: () => {
        set((state) => {
            if (state.discards <= 0) return {};

            const selectedCards = state.hand.filter(c => c.selected);
            if (selectedCards.length === 0) return {};

            const unselectedCards = state.hand.filter(c => !c.selected);
            const newDiscardPile = [...state.discard_pile, ...selectedCards.map(c => c.card)];

            return {
                hand: unselectedCards,
                discard_pile: newDiscardPile,
                discards: state.discards - 1,
                hand_state: HandState.HAND_DRAW
            };
        });

        // draw back up to hand size
        const targetDraws = get().hand_size - get().hand.length;
        for (let i = 0; i < targetDraws; i++) {
            get().card_draw();
        }
        set({ hand_state: HandState.HAND_SELECT, chips: 0, mult: 0, hand_type: HandType.NONE });
    },

    game_playing_execute_play_hand: () => {
        set((state) => {
            if (state.hands <= 0) return {};

            const selectedCards = state.hand.filter(c => c.selected);
            if (selectedCards.length === 0) return {};

            const unselectedCards = state.hand.filter(c => !c.selected);

            return {
                played: selectedCards,
                hand: unselectedCards,
                hands: state.hands - 1,
                hand_state: HandState.HAND_PLAY
            };
        });

        get().score_played_hand();
    },

    hand_select_card: (index: number) => {
        set((state) => {
            if (index < 0 || index >= state.hand.length || state.hand_state !== HandState.HAND_SELECT) return {};

            const newHand = [...state.hand];
            const selectedCount = newHand.filter(c => c.selected).length;

            if (newHand[index].selected) {
                newHand[index].selected = false;
            } else if (selectedCount < 5) {
                newHand[index].selected = true;
            }

            // Update hand evaluation
            const ranks = Array(NUM_RANKS).fill(0);
            const suits = Array(NUM_SUITS).fill(0);
            for (const c of newHand) {
                if (c.selected) {
                    ranks[c.card.rank]++;
                    suits[c.card.suit]++;
                }
            }

            const containedTypes = compute_contained_hand_types(ranks, suits, false, 5);
            const type = compute_hand_type(containedTypes);
            const values = hand_base_values[type];

            return {
                hand: newHand,
                hand_type: type,
                chips: values.chips,
                mult: values.mult
            };
        });
    },

    sort_hand_by_suit: () => {
        set((state) => {
            const newHand = [...state.hand];
            newHand.sort((a, b) => {
                if (a.card.suit !== b.card.suit) {
                    return a.card.suit - b.card.suit;
                }
                return a.card.rank - b.card.rank;
            });
            return { hand: newHand };
        });
    },

    sort_hand_by_rank: () => {
        set((state) => {
            const newHand = [...state.hand];
            newHand.sort((a, b) => b.card.rank - a.card.rank);
            return { hand: newHand };
        });
    },

    score_played_hand: () => {
        set((state) => {
            const currentScore = state.score + (state.chips * state.mult);
            const req = blind_get_requirement(state.current_blind, state.ante);

            let newGameState = state.game_state;
            let newAnte = state.ante;
            let newRound = state.round;

            if (currentScore >= req) {
                if (state.current_blind === BlindType.BLIND_TYPE_BOSS) {
                    newAnte++;
                }
                newGameState = GameState.GAME_STATE_ROUND_END;
            } else if (state.hands === 0) {
                newGameState = GameState.GAME_STATE_LOSE;
            }

            // Cleanup played cards to discard
            const newDiscard = [...state.discard_pile, ...state.played.map(c => c.card)];

            return {
                score: currentScore,
                played: [],
                discard_pile: newDiscard,
                chips: 0,
                mult: 0,
                hand_type: HandType.NONE,
                game_state: newGameState,
                ante: newAnte,
                round: newRound
            };
        });

        const state = get();
        if (state.game_state === GameState.GAME_STATE_PLAYING) {
             const targetDraws = state.hand_size - state.hand.length;
             for (let i = 0; i < targetDraws; i++) {
                 get().card_draw();
             }
             set({ hand_state: HandState.HAND_SELECT });
        }
    }
}));