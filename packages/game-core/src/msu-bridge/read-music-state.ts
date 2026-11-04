/* @layer bridge-wasm @kind logic */
import { byteAt } from '../game-info/read-bytes';
import {
  MUSIC_CMD_BYTES, MUSIC_RING_MAX, MUSIC_STATE_COUNT, MUSIC_STATE_DROPPED, MUSIC_STATE_FADE, MUSIC_STATE_RING,
  MUSIC_STATE_SEQ, MUSIC_STATE_SFX_VOICES, MUSIC_STATE_SONG, MUSIC_STATE_VALID,
} from './msu-bridge.constants';
import type { MusicStateSnapshot, RawMusicCommand } from './music-state.type';

const u32At = (heap: Uint8Array, at: number): number =>
  (byteAt(heap, at) | (byteAt(heap, at + 1) << 8) | (byteAt(heap, at + 2) << 16) | (byteAt(heap, at + 3) << 24)) >>> 0;

const commandAt = (heap: Uint8Array, at: number): RawMusicCommand => ({
  cmd: byteAt(heap, at),
  p1: byteAt(heap, at + 1),
  p2: byteAt(heap, at + 2),
  p3: byteAt(heap, at + 3),
  frame: u32At(heap, at + 4),
});

const readMusicState = (heap: Uint8Array, ptr: number): MusicStateSnapshot | null => {
  if (ptr <= 0 || heap.length < ptr + MUSIC_STATE_RING + MUSIC_RING_MAX * MUSIC_CMD_BYTES) return null;
  const count = Math.min(u32At(heap, ptr + MUSIC_STATE_COUNT), MUSIC_RING_MAX);
  return {
    seq: u32At(heap, ptr + MUSIC_STATE_SEQ),
    dropped: u32At(heap, ptr + MUSIC_STATE_DROPPED),
    song: byteAt(heap, ptr + MUSIC_STATE_SONG),
    sfxVoices: byteAt(heap, ptr + MUSIC_STATE_SFX_VOICES),
    fade: byteAt(heap, ptr + MUSIC_STATE_FADE),
    valid: byteAt(heap, ptr + MUSIC_STATE_VALID) === 1,
    commands: Array.from({ length: count }, (_, i) => commandAt(heap, ptr + MUSIC_STATE_RING + i * MUSIC_CMD_BYTES)),
  };
};

export { readMusicState };
