#ifndef TONC_H
#define TONC_H
#include <stdint.h>
#include <string.h>
#include <stdbool.h>
typedef uint8_t u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef int32_t s32;
typedef int FIXED;
typedef unsigned int uint;
typedef struct { int x, y; } POINT;
typedef POINT BG_POINT;
typedef struct { int left, top, right, bottom; } RECT;
typedef struct { u16 attr0, attr1, attr2, fill; } OBJ_ATTR;
typedef struct { u16 fill0[3], pa, fill1[3], pb, fill2[3], pc, fill3[3], pd; } OBJ_AFFINE;
#define INLINE static inline
#define obj_set_pos(obj, x, y)
#define PAL_ROW_LEN 16
#define ATTR0_SQUARE 0
#define ATTR0_4BPP 0
#define ATTR1_SIZE_32x32 0

extern OBJ_ATTR tile_mem[8][1024];
extern u16 pal_obj_bank[32 * 16];

#endif
