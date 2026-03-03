import type { CardObject } from './card';
import { NUM_RANKS, NUM_SUITS, ACE, TWO, THREE, KING, QUEEN, FIVE } from './card';

export function get_hand_distribution(hand: CardObject[], ranks_out: number[], suits_out: number[]): void {
    for (let i = 0; i < NUM_RANKS; i++) ranks_out[i] = 0;
    for (let i = 0; i < NUM_SUITS; i++) suits_out[i] = 0;

    for (let i = 0; i < hand.length; i++) {
        if (hand[i] && hand[i].selected) {
            ranks_out[hand[i].card.rank]++;
            suits_out[hand[i].card.suit]++;
        }
    }
}

export function get_played_distribution(played: CardObject[], ranks_out: number[], suits_out: number[]): void {
    for (let i = 0; i < NUM_RANKS; i++) ranks_out[i] = 0;
    for (let i = 0; i < NUM_SUITS; i++) suits_out[i] = 0;

    for (let i = 0; i < played.length; i++) {
        if (!played[i]) continue;
        ranks_out[played[i].card.rank]++;
        suits_out[played[i].card.suit]++;
    }
}

export function hand_contains_n_of_a_kind(ranks: number[]): number {
    let highest_n = 0;
    for (let i = 0; i < NUM_RANKS; i++) {
        if (ranks[i] > highest_n) highest_n = ranks[i];
    }
    return highest_n;
}

export function hand_contains_two_pair(ranks: number[]): boolean {
    let contains_other_pair = false;
    for (let i = 0; i < NUM_RANKS; i++) {
        if (ranks[i] >= 2) {
            if (contains_other_pair) return true;
            contains_other_pair = true;
        }
    }
    return false;
}

export function hand_contains_full_house(ranks: number[]): boolean {
    let count_three = 0;
    let count_pair = 0;
    for (let i = 0; i < NUM_RANKS; i++) {
        if (ranks[i] >= 3) {
            count_three++;
        } else if (ranks[i] >= 2) {
            count_pair++;
        }
    }
    return (count_three >= 2 || (count_three > 0 && count_pair > 0));
}

export function hand_contains_straight(ranks: number[], is_shortcut_joker_active: boolean, straight_and_flush_size: number): boolean {
    if (!is_shortcut_joker_active) {
        let run = 0;
        for (let i = 0; i < NUM_RANKS; ++i) {
            if (ranks[i]) {
                if (++run >= straight_and_flush_size) return true;
            } else {
                run = 0;
            }
        }

        if (straight_and_flush_size >= 2 && ranks[ACE]) {
            let last_needed = TWO + (straight_and_flush_size - 2);
            if (last_needed <= FIVE) {
                let ok = true;
                for (let r = TWO; r <= last_needed; ++r) {
                    if (!ranks[r]) {
                        ok = false;
                        break;
                    }
                }
                if (ok) return true;
            }
        }

        return false;
    } else {
        let longest_short_cut_at: number[] = Array(NUM_RANKS).fill(0);
        let ace_low_len = ranks[ACE] ? 1 : 0;

        for (let i = 0; i < NUM_RANKS; i++) {
            if (ranks[i] === 0) {
                longest_short_cut_at[i] = 0;
                continue;
            }

            let prev_len1 = 0;
            let prev_len2 = 0;

            if (i === TWO) {
                prev_len1 = ace_low_len;
            } else if (i === THREE) {
                prev_len1 = longest_short_cut_at[TWO];
                prev_len2 = ace_low_len;
            } else if (i === ACE) {
                prev_len1 = longest_short_cut_at[KING];
                prev_len2 = longest_short_cut_at[QUEEN];
            } else {
                prev_len1 = longest_short_cut_at[i - 1];
                prev_len2 = longest_short_cut_at[i - 2];
            }

            longest_short_cut_at[i] = 1 + Math.max(prev_len1, prev_len2);

            if (longest_short_cut_at[i] >= straight_and_flush_size) {
                return true;
            }
        }
    }

    return false;
}

export function hand_contains_flush(suits: number[], straight_and_flush_size: number): boolean {
    for (let i = 0; i < NUM_SUITS; i++) {
        if (suits[i] >= straight_and_flush_size) {
            return true;
        }
    }
    return false;
}

export function find_flush_in_played_cards(played: CardObject[], min_len: number, out_selection: boolean[]): number {
    for (let i = 0; i < played.length; i++) out_selection[i] = false;

    let suit_counts = Array(NUM_SUITS).fill(0);
    for (let i = 0; i < played.length; i++) {
        if (played[i] && played[i].card) {
            suit_counts[played[i].card.suit]++;
        }
    }

    let best_suit = -1;
    let best_count = 0;
    for (let i = 0; i < NUM_SUITS; i++) {
        if (suit_counts[i] > best_count) {
            best_count = suit_counts[i];
            best_suit = i;
        }
    }

    if (best_count >= min_len) {
        for (let i = 0; i < played.length; i++) {
            if (played[i] && played[i].card && played[i].card.suit === best_suit) {
                out_selection[i] = true;
            }
        }
        return best_count;
    }
    return 0;
}

export function find_straight_in_played_cards(played: CardObject[], shortcut_active: boolean, min_len: number, out_selection: boolean[]): number {
    for (let i = 0; i < played.length; i++) out_selection[i] = false;

    let longest_straight_at: number[] = Array(NUM_RANKS).fill(0);
    let parent: number[] = Array(NUM_RANKS).fill(-1);

    let ranks: number[] = Array(NUM_RANKS).fill(0);
    for (let i = 0; i < played.length; i++) {
        if (played[i] && played[i].card) {
            ranks[played[i].card.rank]++;
        }
    }

    let ace_low_len = ranks[ACE] ? 1 : 0;
    for (let i = 0; i < NUM_RANKS; i++) {
        if (ranks[i] > 0) {
            let prev1 = 0, prev2 = 0;
            let parent1 = -1, parent2 = -1;

            if (shortcut_active) {
                if (i === TWO) {
                    prev1 = ace_low_len;
                    parent1 = ACE;
                } else if (i === THREE) {
                    prev1 = longest_straight_at[TWO];
                    parent1 = TWO;
                    prev2 = ace_low_len;
                    parent2 = ACE;
                } else if (i === ACE) {
                    prev1 = longest_straight_at[KING];
                    parent1 = KING;
                    prev2 = longest_straight_at[QUEEN];
                    parent2 = QUEEN;
                } else {
                    prev1 = longest_straight_at[i - 1];
                    parent1 = i - 1;
                    if (i > 1) {
                        prev2 = longest_straight_at[i - 2];
                        parent2 = i - 2;
                    }
                }
            } else {
                if (i === TWO) {
                    prev1 = ace_low_len;
                    parent1 = ACE;
                } else if (i === ACE) {
                    prev1 = longest_straight_at[KING];
                    parent1 = KING;
                } else {
                    prev1 = longest_straight_at[i - 1];
                    parent1 = i - 1;
                }
            }

            if (prev1 >= prev2) {
                longest_straight_at[i] = 1 + prev1;
                parent[i] = parent1;
            } else {
                longest_straight_at[i] = 1 + prev2;
                parent[i] = parent2;
            }
        }
    }

    let best_len = 0;
    let end_rank = -1;
    for (let i = 0; i < NUM_RANKS; i++) {
        if (longest_straight_at[i] >= best_len) {
            best_len = longest_straight_at[i];
            end_rank = i;
        }
    }

    if (best_len >= min_len) {
        let needed_ranks: number[] = Array(NUM_RANKS).fill(0);
        let current_rank = end_rank;
        while (current_rank !== -1 && best_len > 0) {
            needed_ranks[current_rank]++;
            current_rank = parent[current_rank];
            best_len--;
        }

        for (let i = 0; i < played.length; i++) {
            if (played[i] && played[i].card && needed_ranks[played[i].card.rank] > 0) {
                out_selection[i] = true;
                needed_ranks[played[i].card.rank]--;
            }
        }

        let final_card_count = 0;
        for (let i = 0; i < played.length; i++) {
            if (out_selection[i]) final_card_count++;
        }
        return final_card_count;
    }
    return 0;
}

export function select_paired_cards_in_hand(played: CardObject[], selection: boolean[]): void {
    let rank_selected: boolean[] = Array(NUM_RANKS).fill(false);
    let any_selected_rank = false;

    for (let i = 0; i < played.length; i++) {
        if (selection[i] && played[i] && played[i].card) {
            rank_selected[played[i].card.rank] = true;
            any_selected_rank = true;
        }
    }

    if (!any_selected_rank) return;

    for (let i = 0; i < played.length; i++) {
        if (played[i] && played[i].card && !selection[i]) {
            if (rank_selected[played[i].card.rank]) {
                selection[i] = true;
            }
        }
    }
}