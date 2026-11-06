/* @layer bridge-wasm @kind logic */
import { byteAt } from '../game-info/read-bytes';
import { HAPTIC_EVENT_BYTES, HAPTIC_RING_MAX, HAPTIC_STATE_COUNT, HAPTIC_STATE_RING } from './haptic-polling.constants';
import type { RawHapticEvent } from './haptic-polling.type';

const u32At = (heap: Uint8Array, at: number): number =>
  (byteAt(heap, at) | (byteAt(heap, at + 1) << 8) | (byteAt(heap, at + 2) << 16) | (byteAt(heap, at + 3) << 24)) >>> 0;

const readHapticEvents = (heap: Uint8Array, ptr: number): RawHapticEvent[] => {
  if (ptr <= 0 || heap.length < ptr + HAPTIC_STATE_RING + HAPTIC_RING_MAX * HAPTIC_EVENT_BYTES) return [];
  const count = Math.min(u32At(heap, ptr + HAPTIC_STATE_COUNT), HAPTIC_RING_MAX);
  return Array.from({ length: count }, (_, i) => {
    const at = ptr + HAPTIC_STATE_RING + i * HAPTIC_EVENT_BYTES;
    return { kind: u32At(heap, at), param: u32At(heap, at + 4) };
  });
};

export { readHapticEvents };
