/* @layer shared-asset-extraction @kind logic */
import { lzDecompress } from './lz-decompress';
import { getEntries3Byte } from './rom-read';
import { decodeString } from './text-tokens';
import type { DecodeOptions } from './text-tokens';

const MAX_STRINGS = 256;
const MAX_LEN = 512;

/** text.read_textbox_table: strings until consecutive pointers stop looking like string bounds (the packer's B8 filter only). */
const readTextboxTable = (rom: Uint8Array, addr: number, subs: string[], opts: DecodeOptions): string[] => {
  const page = addr & 0xff0000;
  const out: string[] = [];
  for (let i = 0; i < MAX_STRINGS; i += 1) {
    const ptr = rom[addr + i * 2]! | (rom[addr + i * 2 + 1]! << 8);
    const nxt = rom[addr + i * 2 + 2]! | (rom[addr + i * 2 + 3]! << 8);
    if (nxt < ptr || nxt - ptr > MAX_LEN) break;
    out.push(decodeString(rom, page + ptr, subs, opts));
  }
  return out;
};

/** text.read_dialogue_table: string i is the u16 at table + 2*i in the table's bank; all 256 indices. */
const readDialogueTable = (rom: Uint8Array, addr: number, subs: string[], opts: DecodeOptions): string[] => {
  const page = addr & 0xff0000;
  const out: string[] = [];
  for (let i = 0; i < 256; i += 1) {
    out.push(decodeString(rom, page + (rom[addr + i * 2]! | (rom[addr + i * 2 + 1]! << 8)), subs, opts));
  }
  return out;
};

/** text.scan_dialogue_tables: op 0xB8 (set string table) + a 24-bit pointer in each scene script -> {file addr: strings}. */
const scanDialogueTables = (rom: Uint8Array, subs: string[], opts: DecodeOptions): Map<number, string[]> => {
  const tables = new Map<number, string[]>();
  for (const sp of getEntries3Byte(rom, 0x3cf9f0, 513)) {
    if (sp === 0 || sp >= rom.length) continue;
    let scr: Uint8Array;
    try {
      scr = lzDecompress(rom, sp);
    } catch {
      continue;
    }
    for (let i = 0; i < scr.length - 3; i += 1) {
      if (scr[i] !== 0xb8) continue;
      const snes = scr[i + 1]! | (scr[i + 2]! << 8) | (scr[i + 3]! << 16);
      if (snes < 0xc00000 || snes > 0xffffff) continue;
      const addr = snes - 0xc00000;
      if (tables.has(addr) || addr + 512 >= rom.length) continue;
      if (readTextboxTable(rom, addr, subs, opts).length >= 4) tables.set(addr, readDialogueTable(rom, addr, subs, opts));
    }
  }
  return tables;
};

export { scanDialogueTables };
