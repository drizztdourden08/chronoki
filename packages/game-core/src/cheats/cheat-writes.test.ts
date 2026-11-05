/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { giveItem } from './give-item';
import { refillCharacter } from './refill-character';
import { setGold } from './set-gold';

const PTR = 0x100;
const makeHeap = (): Uint8Array => new Uint8Array(PTR + 0x20000);
const writerOf = (heap: Uint8Array) => (offset: number, bytes: Uint8Array): boolean => {
  heap.set(bytes, PTR + offset);
  return true;
};

describe('cheat writes', () => {
  it('stacks an item up to 99 and uses the first empty slot', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    const write = writerOf(heap);
    expect(giveItem(heap, PTR, write, 0x10, 60)).toBe(true);
    expect(giveItem(heap, PTR, write, 0x10, 60)).toBe(true);
    expect(heap[PTR + 0x2400]).toBe(0x10);
    expect(heap[PTR + 0x2500]).toBe(99);
    expect(giveItem(heap, PTR, write, 0x11, 1)).toBe(true);
    expect(heap[PTR + 0x2401]).toBe(0x11);
    expect(giveItem(heap, PTR, write, 0, 1)).toBe(false);
  });

  it('writes gold little-endian and clamps it', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    expect(setGold(writerOf(heap), 0x010203)).toBe(true);
    expect([...heap.subarray(PTR + 0x2c53, PTR + 0x2c56)]).toEqual([3, 2, 1]);
    setGold(writerOf(heap), 99999999);
    expect([...heap.subarray(PTR + 0x2c53, PTR + 0x2c56)]).toEqual([0x7f, 0x96, 0x98]);
  });

  it('refills HP and MP to the maximum', { tags: ['critical'] }, () => {
    const heap = makeHeap();
    const sheet = PTR + 0x2600 + 0x50;
    heap.set([0x2c, 0x01], sheet + 0x3f);
    heap.set([0x32, 0x00], sheet + 0x09);
    expect(refillCharacter(heap, PTR, writerOf(heap), 1)).toBe(true);
    expect([...heap.subarray(sheet + 3, sheet + 5)]).toEqual([0x2c, 0x01]);
    expect([...heap.subarray(sheet + 7, sheet + 9)]).toEqual([0x32, 0x00]);
    expect(refillCharacter(heap, PTR, writerOf(heap), 7)).toBe(false);
  });
});
