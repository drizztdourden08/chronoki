/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { CLOCK_FROZEN_FLAG } from '../../game-info/wram-map.constants';
import { createCtMemoryBridge } from '../memory/create-ct-memory-bridge';
import { createCtMemoryView } from '../memory/create-ct-memory-view';
import { createCtWramWriter } from '../memory/create-ct-wram-writer';
import type { CtMemoryOptions } from '../memory/ct-memory-options.type';
import { isCtSafeFrame } from './is-ct-safe-frame';

const PTR = 0x40;
const optionsOf = (heap: Uint8Array | null, live = true): CtMemoryOptions => ({
  heap: () => heap, wramPtr: () => PTR, isLive: () => live, onLoaded: () => () => undefined,
});

describe('isCtSafeFrame', () => {
  it('is safe only with a view and the busy bytes clear', { tags: ['critical'] }, () => {
    const heap = new Uint8Array(PTR + 0x20000);
    expect(isCtSafeFrame(null)).toBe(false);
    expect(isCtSafeFrame(createCtMemoryView(heap, PTR))).toBe(true);
    heap[PTR + CLOCK_FROZEN_FLAG] = 1;
    expect(isCtSafeFrame(createCtMemoryView(heap, PTR))).toBe(false);
  });
});

describe('createCtMemoryBridge and writer', () => {
  it('has no view when not live or when the heap is short', { tags: ['critical'] }, () => {
    expect(createCtMemoryBridge(optionsOf(new Uint8Array(PTR + 0x20000), false)).view()).toBeNull();
    expect(createCtMemoryBridge(optionsOf(new Uint8Array(0x100))).view()).toBeNull();
    expect(createCtMemoryBridge(optionsOf(null)).view()).toBeNull();
  });

  it('reads wram bytes and words and writes only on a safe frame', { tags: ['critical'] }, () => {
    const heap = new Uint8Array(PTR + 0x20000);
    heap[PTR + 0x100] = 0x34;
    heap[PTR + 0x101] = 0x12;
    const options = optionsOf(heap);
    const bridge = createCtMemoryBridge(options);
    expect(bridge.view()?.word('wram', 0x100)).toBe(0x1234);
    expect(bridge.view()?.byte('other', 0x100)).toBe(0);
    const write = createCtWramWriter(options, bridge);
    expect(write(0x2400, Uint8Array.of(7))).toBe(true);
    expect(heap[PTR + 0x2400]).toBe(7);
    expect(write(0x1ffff, Uint8Array.of(1, 2))).toBe(false);
    heap[PTR + CLOCK_FROZEN_FLAG] = 1;
    expect(write(0x2400, Uint8Array.of(9))).toBe(false);
    expect(heap[PTR + 0x2400]).toBe(7);
  });
});
