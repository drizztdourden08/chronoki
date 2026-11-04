/* @layer shared-asset-extraction @kind logic @source Python extract_assets.snd_code_map, extract_assets.pack_sound */
import type { CtasEntry } from '../ctas/ctas.type';
import {
  T_SND_BOOT,
  T_SND_INSTR,
  T_SND_MISC,
  T_SND_SAMPLE,
  T_SND_SEQ,
  T_SND_SFXSET,
  T_SND_SONG,
  T_SND_TIMING,
} from './asset-types.constants';
import { byteAt } from './bytes/byte-reader';
import { wordAt } from './bytes/word-at';
import { concatBytes } from './bytes/concat-bytes';
import { createBlobWriter } from './bytes/blob-writer';
import type { Packer } from './extract.type';
import { FD } from './pack-sound.constants';

const C7 = 0x70000;

const p24 = (rom: Uint8Array, o: number): number => ((byteAt(rom, o + 2) - 0xc0) << 16) | wordAt(rom, o);
const u16le = (v: number): Uint8Array => Uint8Array.of(v & 0xff, (v >> 8) & 0xff);
const sub = (rom: Uint8Array, a: number, b: number): Uint8Array => rom.subarray(a, b);

const codeMap = (timing: Uint8Array): { blo: number; blen: number; cmap: Uint8Array } => {
  const tag = String.fromCharCode(timing[0] ?? 0, timing[1] ?? 0, timing[2] ?? 0, timing[3] ?? 0);
  if (timing.length < 12 || tag !== 'SNDT') throw new Error('saves/snd_timing.bin: not a cost table');
  const blen = wordAt(timing, 10);
  return { blo: wordAt(timing, 8), blen, cmap: timing.subarray(12, 12 + ((blen + 7) >> 3)) };
};

const bootBlocks = (rom: Uint8Array, timing: Uint8Array | null): CtasEntry[] => {
  const out: CtasEntry[] = [];
  for (let b = 0; b < 6; b += 1) {
    const at = C7 + wordAt(rom, C7 + 0x10 + 2 * b);
    const blk = rom.slice(at + 2, at + 2 + wordAt(rom, at));
    if (b === 0 && timing) {
      const { blo, blen, cmap } = codeMap(timing);
      if (blo !== wordAt(rom, C7 + 0x1c) || blen !== blk.length) throw new Error("saves/snd_timing.bin is not this ROM's block 0");
      for (let k = 0; k < blen; k += 1) if (((byteAt(cmap, k >> 3) >> (k & 7)) & 1) !== 0) blk[k] = 0;
    }
    out.push({ type: T_SND_BOOT, id: b, blob: concatBytes([u16le(wordAt(rom, C7 + 0x1c + 2 * b)), blk]) });
  }
  return out;
};

const songData = (rom: Uint8Array, nsong: number): CtasEntry[] => {
  const out: CtasEntry[] = [];
  for (let s = 0; s < nsong; s += 1) {
    const at = p24(rom, C7 + 0x0d18 + 3 * s);
    out.push({ type: T_SND_SEQ, id: s, blob: concatBytes([u16le(at), sub(rom, at + 2, at + 2 + wordAt(rom, at) + 3)]) });
    const song = concatBytes([
      sub(rom, C7 + 0x0e11 + 32 * s, C7 + 0x0e11 + 32 * s + 32),
      sub(rom, C7 + 0x1871 + 36 * s, C7 + 0x1871 + 36 * s + 36),
      sub(rom, C7 + 0x241d + 2 * s, C7 + 0x241d + 2 * s + 2),
    ]);
    out.push({ type: T_SND_SONG, id: s, blob: song });
  }
  const ninst = Math.floor((0x0ba4 - 0x0aea) / 3);
  for (let i = 1; i <= ninst; i += 1) {
    const at = p24(rom, C7 + 0x0aea + 3 * (i - 1));
    out.push({ type: T_SND_SAMPLE, id: i, blob: concatBytes([u16le(at), sub(rom, at + 2, at + 2 + wordAt(rom, at))]) });
  }
  for (let i = 0; i <= ninst; i += 1) {
    const k = ((i - 1) * 2) & 0xffff;
    const blob = concatBytes([u16le(wordAt(rom, C7 + 0x0ba4 + k)), u16le(wordAt(rom, C7 + 0x0c20 + k)), u16le(wordAt(rom, C7 + 0x0c9c + k))]);
    out.push({ type: T_SND_INSTR, id: i, blob });
  }
  [C7 + 0x4309, C7 + 0x5b0b].forEach((at, k) => {
    out.push({ type: T_SND_SFXSET, id: k, blob: rom.slice(at + 2, at + 2 + wordAt(rom, at)) });
  });
  return out;
};

const miscData = (rom: Uint8Array, nsong: number): CtasEntry[] => {
  const exc: number[] = [];
  for (let o = C7 + 0x0ad8; ; o += 1) {
    const v = byteAt(rom, o);
    exc.push(v);
    if ((v & 0x80) !== 0) break;
  }
  const hdma = createBlobWriter();
  for (let i = 0; i < 8; i += 1) hdma.u8(byteAt(rom, FD + 0xc1f8 + 4 * i));
  for (let i = 0; i < 8; i += 1) hdma.u16(wordAt(rom, FD + 0xc26e + 5 * i));
  for (let i = 0; i < 8; i += 1) hdma.u16(wordAt(rom, FD + 0xc298 + 5 * i));
  return [
    { type: T_SND_MISC, id: 0, blob: Uint8Array.of(nsong, ...exc) },
    { type: T_SND_MISC, id: 1, blob: hdma.toBytes() },
  ];
};

const packSound: Packer = async ({ rom, work }) => {
  const timing = await work.readBytes('saves/snd_timing.bin');
  const entries: CtasEntry[] = [];
  if (timing && timing.length > 0) entries.push({ type: T_SND_TIMING, id: 0, blob: timing });
  entries.push(...bootBlocks(rom, timing && timing.length > 0 ? timing : null));
  const nsong = byteAt(rom, C7 + 0x0ae9);
  entries.push(...songData(rom, nsong), ...miscData(rom, nsong));
  return entries;
};

export { packSound };
