export const MAX_ANTE = 8;

export enum BlindType {
    BLIND_TYPE_SMALL,
    BLIND_TYPE_BIG,
    BLIND_TYPE_BOSS,
    BLIND_TYPE_MAX
}

export enum BlindState {
    BLIND_STATE_CURRENT,
    BLIND_STATE_UPCOMING,
    BLIND_STATE_DEFEATED,
    BLIND_STATE_SKIPPED,
    BLIND_STATE_MAX
}

const ante_lut: number[] = [100, 300, 800, 2000, 5000, 11000, 20000, 35000, 50000];

export interface BlindInfo {
    score_req_multiplier: number;
    reward: number;
}

export const blind_type_map: Record<BlindType, BlindInfo> = {
    [BlindType.BLIND_TYPE_SMALL]: { score_req_multiplier: 1.0, reward: 3 },
    [BlindType.BLIND_TYPE_BIG]: { score_req_multiplier: 1.5, reward: 4 },
    [BlindType.BLIND_TYPE_BOSS]: { score_req_multiplier: 2.0, reward: 5 },
    [BlindType.BLIND_TYPE_MAX]: { score_req_multiplier: 0, reward: 0 },
};

export function blind_get_requirement(type: BlindType, ante: number): number {
    if (ante < 0 || ante > MAX_ANTE) ante = 0;
    return Math.floor(blind_type_map[type].score_req_multiplier * ante_lut[ante]);
}

export function blind_get_reward(type: BlindType): number {
    return blind_type_map[type].reward;
}