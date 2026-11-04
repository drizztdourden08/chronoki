/* @layer shared-asset-extraction @kind logic @source Python script.load_script */
import { byteAt } from '../bytes/byte-reader';
import { lzDecompress } from '../lz-decompress';
import { getEntries3Byte } from '../rom-read';
import { SCRIPT_PTRS } from './script-load.constants';
import type { LoadedScript } from './script-load.type';

const pointerCache = new WeakMap<Uint8Array, number[]>();

const scriptPointers = (rom: Uint8Array): number[] => {
  const hit = pointerCache.get(rom);
  if (hit) return hit;
  const ptrs = getEntries3Byte(rom, SCRIPT_PTRS, 513);
  pointerCache.set(rom, ptrs);
  return ptrs;
};

const loadScript = (rom: Uint8Array, scriptIndex: number): LoadedScript => {
  const ptrs = scriptPointers(rom);
  const ptr = ptrs[scriptIndex];
  if (ptr === undefined || ptr === 0) return { objs: [], body: new Uint8Array(0) };
  const raw = lzDecompress(rom, ptr);
  if (raw.length < 1) return { objs: [], body: new Uint8Array(0) };
  const count = byteAt(raw, 0);
  const headerSize = count * 32;
  const objs: number[][] = [];
  let o = 1;
  for (let n = 0; n < count; n += 1) {
    objs.push(Array.from({ length: 16 }, (_, i) => (byteAt(raw, o + i * 2) | (byteAt(raw, o + i * 2 + 1) << 8)) - headerSize));
    o += 32;
  }
  return { objs, body: raw.slice(1 + headerSize) };
};

export { loadScript, SCRIPT_PTRS, scriptPointers };
export type { LoadedScript };
