#include <blind.h>
#include <assert.h>
#include <stdio.h>
#include <stdint.h>

void test_blind_get_requirement()
{
    // Small Blind, Ante 1: 1.0 * 300 = 300
    u32 req = blind_get_requirement(BLIND_TYPE_SMALL, 1);
    printf("Small Blind Ante 1: %u\n", req);
    assert(req == 300);

    // Big Blind, Ante 1: 1.5 * 300 = 450
    req = blind_get_requirement(BLIND_TYPE_BIG, 1);
    printf("Big Blind Ante 1: %u\n", req);
    assert(req == 450);

    // Boss Blind, Ante 1: 2.0 * 300 = 600
    req = blind_get_requirement(BLIND_TYPE_BOSS, 1);
    printf("Boss Blind Ante 1: %u\n", req);
    assert(req == 600);

    // Small Blind, Ante 2: 1.0 * 800 = 800
    assert(blind_get_requirement(BLIND_TYPE_SMALL, 2) == 800);

    // Edge case: Ante 0: 1.0 * 100 = 100
    assert(blind_get_requirement(BLIND_TYPE_SMALL, 0) == 100);

    // Edge case: Ante out of range (too high): should default to Ante 0
    assert(blind_get_requirement(BLIND_TYPE_SMALL, 9) == 100);

    // Edge case: Ante out of range (negative): should default to Ante 0
    assert(blind_get_requirement(BLIND_TYPE_SMALL, -1) == 100);

    printf("test_blind_get_requirement passed!\n");
}

void test_blind_get_reward()
{
    assert(blind_get_reward(BLIND_TYPE_SMALL) == 3);
    assert(blind_get_reward(BLIND_TYPE_BIG) == 4);
    assert(blind_get_reward(BLIND_TYPE_BOSS) == 5);
    printf("test_blind_get_reward passed!\n");
}

int main()
{
    test_blind_get_requirement();
    test_blind_get_reward();
    return 0;
}
