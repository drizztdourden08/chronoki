/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { decodeCString } from './decode-c-string';
import { gameInfoChanged } from './game-info-changed';
import { readGameInfo } from './read-game-info';

const PTR = 0x100;
const makeHeap = (): Uint8Array => new Uint8Array(PTR + 0x20000);
const put = (heap: Uint8Array, at: number, ...bytes: number[]): void => {
  bytes.forEach((b, i) => {
    heap[PTR + at + i] = b;
  });
};

const allFalse = (row: boolean[]): boolean => row.every((bit) => !bit);

describe('readGameInfo basics', () => {
  it('refuses a null pointer or a short heap', { tags: ['critical'] }, () => {
    expect(readGameInfo(makeHeap(), 0)).toBeNull();
    expect(readGameInfo(new Uint8Array(0x100), PTR)).toBeNull();
  });

  it('masks the location to 0x1FF and flags the overworld range', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x0100, 0xf3, 0xfd);
    const info = readGameInfo(heap, PTR);
    expect(info?.location.id).toBe(0x1f3);
    expect(info?.location.overworld).toBe(true);
  });

  it('treats bit 7 party slots as empty', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x2980, 0x02, 0x80, 0xff);
    put(heap, 0x2983, 0x04, 0x80);
    const info = readGameInfo(heap, PTR);
    expect(info?.party.active).toEqual([2, null, null]);
    expect(info?.party.reserve.slice(0, 2)).toEqual([4, null]);
  });

  it('reads a sheet and derives KO from zero HP', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x2600 + 0x50 + 0x12, 12);
    put(heap, 0x2600 + 0x50 + 0x3f, 0x2c, 0x01);
    const sheet = readGameInfo(heap, PTR)?.party.sheets[1];
    expect(sheet?.level).toBe(12);
    expect(sheet?.maxHp).toBe(300);
    expect(sheet?.ko).toBe(true);
  });

});

describe('readGameInfo party and economy', () => {
  it('reads 24-bit gold little endian', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x2c53, 0x40, 0x42, 0x0f);
    expect(readGameInfo(heap, PTR)?.gold).toBe(1000000);
  });

  it('reads the clock and caps it at 99:59', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x0400, 0, 7, 3, 4, 2, 1);
    expect(readGameInfo(heap, PTR)?.clock).toMatchObject({ hours: 12, minutes: 43, seconds: 7, capped: false });
    put(heap, 0x0406, 1);
    expect(readGameInfo(heap, PTR)?.clock).toMatchObject({ hours: 99, minutes: 59, capped: true });
  });

  it('lists inventory slots that have an id and a count', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x2400, 0x10, 0x00, 0x20);
    put(heap, 0x2500, 5, 9, 0);
    expect(readGameInfo(heap, PTR)?.inventory).toEqual([{ slot: 0, id: 0x10, count: 5 }]);
  });

  it('reads single techs most significant bit first', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x2837 + 2, 0b10100000);
    const bits = readGameInfo(heap, PTR)?.techs.single[2];
    expect(bits?.slice(0, 4)).toEqual([true, false, true, false]);
  });

  it('reads no learned techs as all-false rows', { tags: ['critical'] }, () => {
    const techs = readGameInfo(makeHeap(), PTR)?.techs;
    expect(techs?.single.every(allFalse)).toBe(true);
    expect(techs?.multiLearned).toBe(0);
  });

});

describe('readGameInfo world state', () => {
  it('reads the lead position from the object tables in pixels', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x1800, 0x00, 0x08);
    put(heap, 0x1880, 0x40, 0x04);
    expect(readGameInfo(heap, PTR)?.location).toMatchObject({ leadX: 0x80, leadY: 0x44 });
  });

  it('reports an unused lead object as unknown', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x1800, 0x00, 0xff);
    expect(readGameInfo(heap, PTR)?.location.leadX).toBeNull();
  });

  it('hides the Epoch until it is set or boarded', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    expect(readGameInfo(heap, PTR)?.location.epoch).toBeNull();
    put(heap, 0x0290, 0x10, 0x00, 0x20, 0x00, 1);
    expect(readGameInfo(heap, PTR)?.location.epoch).toEqual({ x: 0x10, y: 0x20, boarded: true });
  });

  it('counts story chest bits and reads the counter', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    put(heap, 0x10000, 0x6c, 0x03, 0x80);
    expect(readGameInfo(heap, PTR)?.story).toEqual({ counter: 0x6c, chestsOpened: 3 });
  });
});

describe('gameInfoChanged', () => {
  it('lists only the changed sections', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    const a = readGameInfo(heap, PTR);
    put(heap, 0x2c53, 1);
    const b = readGameInfo(heap, PTR);
    expect(a && b && gameInfoChanged(a, b)).toEqual(['gold']);
    expect(b && gameInfoChanged(null, b)).toHaveLength(10);
  });
});

describe('decodeCString', () => {
  it('stops at NUL', { tags: ['critical'] }, () => {
    expect(decodeCString(Uint8Array.from([72, 105, 0, 88]), 0)).toBe('Hi');
  });
});
