/* @layer shared-asset-extraction @kind logic @source Python script.load_script */
import { byteAt } from '../bytes/byte-reader';
import { lzDecompress } from '../lz-decompress';
import type { LoadedScript } from './script-load.type';
import { scriptPointers } from './script-pointers';

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

export { loadScript };
export type { LoadedScript };
