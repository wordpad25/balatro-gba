CC := gcc
CFLAGS := -Iinclude -I../../include -I. \
          -g -O3 -std=gnu2x -Wall -Werror -Wno-format \
          -D'memcpy32(dest, src, count)=memcpy(dest, src, (count)*4)' \
          -D'memcpy16(dest, src, count)=memcpy(dest, src, (count)*2)' \
          -D'FIX_SHIFT=8' -D'int2fx(x)=((x) << FIX_SHIFT)' -D'fx2int(x)=((x) >> FIX_SHIFT)' -D'FIX_ONE=int2fx(1)'

MOCKS_SRC := mocks.c
SRC            := blind_test.c ../../source/blind.c $(MOCKS_SRC)
OUT            := build/blind_test

$(OUT): $(SRC) | build
	$(CC) $(CFLAGS) -o $@ $^

build:
	mkdir -p build

clean:
	rm -rf build
