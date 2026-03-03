import { hand_contains_n_of_a_kind, hand_contains_two_pair, hand_contains_straight, hand_contains_flush, hand_contains_full_house } from "./hand_analysis";
import { ACE, JACK, QUEEN, KING, TEN } from "./card";

export enum GameState {
    GAME_STATE_SPLASH_SCREEN,
    GAME_STATE_MAIN_MENU,
    GAME_STATE_PLAYING,
    GAME_STATE_ROUND_END,
    GAME_STATE_SHOP,
    GAME_STATE_BLIND_SELECT,
    GAME_STATE_LOSE,
    GAME_STATE_WIN,
    GAME_STATE_MAX,
    GAME_STATE_UNDEFINED
}

export enum HandState {
    HAND_DRAW,
    HAND_SELECT,
    HAND_SHUFFLING,
    HAND_DISCARD,
    HAND_PLAY,
    HAND_PLAYING
}

export enum PlayState {
    PLAY_STARTING,
    PLAY_BEFORE_SCORING,
    PLAY_SCORING_CARDS,
    PLAY_SCORING_CARD_JOKERS,
    PLAY_SCORING_HELD_CARDS,
    PLAY_SCORING_INDEPENDENT_JOKERS,
    PLAY_SCORING_HAND_SCORED_END,
    PLAY_ENDING,
    PLAY_ENDED
}

export enum HandType {
    NONE,
    HIGH_CARD,
    PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    STRAIGHT,
    FLUSH,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    STRAIGHT_FLUSH,
    ROYAL_FLUSH,
    FIVE_OF_A_KIND,
    FLUSH_HOUSE,
    FLUSH_FIVE
}

export interface HandValues {
    chips: number;
    mult: number;
    display_name: string | null;
}

export const hand_base_values: Record<HandType, HandValues> = {
    [HandType.NONE]:            { chips: 0,   mult: 0,  display_name: null },
    [HandType.HIGH_CARD]:       { chips: 5,   mult: 1,  display_name: "HIGH C" },
    [HandType.PAIR]:            { chips: 10,  mult: 2,  display_name: "PAIR" },
    [HandType.TWO_PAIR]:        { chips: 20,  mult: 2,  display_name: "2 PAIR" },
    [HandType.THREE_OF_A_KIND]: { chips: 30,  mult: 3,  display_name: "3 OAK" },
    [HandType.STRAIGHT]:        { chips: 30,  mult: 4,  display_name: "STRT" },
    [HandType.FLUSH]:           { chips: 35,  mult: 4,  display_name: "FLUSH" },
    [HandType.FULL_HOUSE]:      { chips: 40,  mult: 4,  display_name: "FULL H" },
    [HandType.FOUR_OF_A_KIND]:  { chips: 60,  mult: 7,  display_name: "4 OAK" },
    [HandType.STRAIGHT_FLUSH]:  { chips: 100, mult: 8,  display_name: "STRT F" },
    [HandType.ROYAL_FLUSH]:     { chips: 100, mult: 8,  display_name: "ROYAL F" },
    [HandType.FIVE_OF_A_KIND]:  { chips: 120, mult: 12, display_name: "5 OAK" },
    [HandType.FLUSH_HOUSE]:     { chips: 140, mult: 14, display_name: "FLUSH H" },
    [HandType.FLUSH_FIVE]:      { chips: 160, mult: 16, display_name: "FLUSH 5" }
};

export interface ContainedHandTypes {
    HIGH_CARD: boolean;
    PAIR: boolean;
    TWO_PAIR: boolean;
    THREE_OF_A_KIND: boolean;
    STRAIGHT: boolean;
    FLUSH: boolean;
    FULL_HOUSE: boolean;
    FOUR_OF_A_KIND: boolean;
    STRAIGHT_FLUSH: boolean;
    ROYAL_FLUSH: boolean;
    FIVE_OF_A_KIND: boolean;
    FLUSH_HOUSE: boolean;
    FLUSH_FIVE: boolean;
}

export function compute_contained_hand_types(ranks: number[], suits: number[], is_shortcut_joker_active: boolean, straight_and_flush_size: number): ContainedHandTypes {
    let hand_types: ContainedHandTypes = {
        HIGH_CARD: true,
        PAIR: false,
        TWO_PAIR: false,
        THREE_OF_A_KIND: false,
        STRAIGHT: false,
        FLUSH: false,
        FULL_HOUSE: false,
        FOUR_OF_A_KIND: false,
        STRAIGHT_FLUSH: false,
        ROYAL_FLUSH: false,
        FIVE_OF_A_KIND: false,
        FLUSH_HOUSE: false,
        FLUSH_FIVE: false
    };

    let n_of_a_kind = hand_contains_n_of_a_kind(ranks);

    if (n_of_a_kind >= 2) {
        hand_types.PAIR = true;
        if (hand_contains_two_pair(ranks)) {
            hand_types.TWO_PAIR = true;
        }
    }

    if (n_of_a_kind >= 3) {
        hand_types.THREE_OF_A_KIND = true;
    }

    if (hand_contains_straight(ranks, is_shortcut_joker_active, straight_and_flush_size)) {
        hand_types.STRAIGHT = true;
    }

    if (hand_contains_flush(suits, straight_and_flush_size)) {
        hand_types.FLUSH = true;
    }

    if (n_of_a_kind >= 3 && hand_contains_full_house(ranks)) {
        hand_types.FULL_HOUSE = true;
    }

    if (n_of_a_kind >= 4) {
        hand_types.FOUR_OF_A_KIND = true;
    }

    if (hand_types.STRAIGHT && hand_types.FLUSH) {
        hand_types.STRAIGHT_FLUSH = true;
    }

    if (hand_types.STRAIGHT_FLUSH) {
        if (ranks[TEN] && ranks[JACK] && ranks[QUEEN] && ranks[KING] && ranks[ACE]) {
            hand_types.ROYAL_FLUSH = true;
        }
    }

    if (n_of_a_kind >= 5) {
        hand_types.FIVE_OF_A_KIND = true;
    }

    if (hand_types.FLUSH) {
        if (hand_types.FULL_HOUSE) {
            hand_types.FLUSH_HOUSE = true;
        }
        if (hand_types.FIVE_OF_A_KIND) {
            hand_types.FLUSH_FIVE = true;
        }
    }

    return hand_types;
}

export function compute_hand_type(contained_types: ContainedHandTypes): HandType {
    if (contained_types.FLUSH_FIVE) return HandType.FLUSH_FIVE;
    if (contained_types.FLUSH_HOUSE) return HandType.FLUSH_HOUSE;
    if (contained_types.FIVE_OF_A_KIND) return HandType.FIVE_OF_A_KIND;
    if (contained_types.ROYAL_FLUSH) return HandType.ROYAL_FLUSH;
    if (contained_types.STRAIGHT_FLUSH) return HandType.STRAIGHT_FLUSH;
    if (contained_types.FOUR_OF_A_KIND) return HandType.FOUR_OF_A_KIND;
    if (contained_types.FULL_HOUSE) return HandType.FULL_HOUSE;
    if (contained_types.FLUSH) return HandType.FLUSH;
    if (contained_types.STRAIGHT) return HandType.STRAIGHT;
    if (contained_types.THREE_OF_A_KIND) return HandType.THREE_OF_A_KIND;
    if (contained_types.TWO_PAIR) return HandType.TWO_PAIR;
    if (contained_types.PAIR) return HandType.PAIR;
    if (contained_types.HIGH_CARD) return HandType.HIGH_CARD;
    return HandType.NONE;
}