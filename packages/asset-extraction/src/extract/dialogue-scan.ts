/* @layer shared-asset-extraction @kind logic @source Python text.read_textbox_table, text.read_dialogue_table, text.scan_dialogue_tables */
import { lzDecompress } from './lz-decompress';
import { getEntries3Byte } from './rom-read';
import { decodeString } from './text-tokens';
import type { DecodeOptions } from './text-tokens';
import { MAX_STRINGS, MAX_LEN } from './dialogue-scan.constants';

const readTextboxTable = (rom: Uint8Array, addr: number, subs: string[], opts: DecodeOptions): string[] => {
  const page = addr & 0xff0000;
  const out: string[] = [];
  for (let i = 0; i < MAX_STRINGS; i += 1) {
    const ptr = (rom[addr + i * 2] as number) | ((rom[addr + i * 2 + 1] as number) << 8);
    const nxt = (rom[addr + i * 2 + 2] as number) | ((rom[addr + i * 2 + 3] as number) << 8);
    if (nxt < ptr || nxt - ptr > MAX_LEN) break;
    out.push(decodeString(rom, page + ptr, subs, opts));
  }
  return out;
};

const readDialogueTable = (rom: Uint8Array, addr: number, subs: string[], opts: DecodeOptions): string[] => {
  const page = addr & 0xff0000;
  const out: string[] = [];
  for (let i = 0; i < 256; i += 1) {
    out.push(decodeString(rom, page + ((rom[addr + i * 2] as number) | ((rom[addr + i * 2 + 1] as number) << 8)), subs, opts));
  }
  return out;
};

const tryDecompress = (rom: Uint8Array, sp: number): Uint8Array | null => {
  try {
    return lzDecompress(rom, sp);
  } catch {
    return null;
  }
};

const scanScript = (
  scr: Uint8Array,
  { rom, subs, opts }: { rom: Uint8Array; subs: string[]; opts: DecodeOptions },
  tables: Map<number, string[]>,
): void => {
  for (let i = 0; i < scr.length - 3; i += 1) {
    if (scr[i] !== 0xb8) continue;
    const snes = (scr[i + 1] as number) | ((scr[i + 2] as number) << 8) | ((scr[i + 3] as number) << 16);
    if (snes < 0xc00000 || snes > 0xffffff) continue;
    const addr = snes - 0xc00000;
    if (tables.has(addr) || addr + 512 >= rom.length) continue;
    if (readTextboxTable(rom, addr, subs, opts).length >= 4) tables.set(addr, readDialogueTable(rom, addr, subs, opts));
  }
};

const scanDialogueTables = (rom: Uint8Array, subs: string[], opts: DecodeOptions): Map<number, string[]> => {
  const tables = new Map<number, string[]>();
  for (const sp of getEntries3Byte(rom, 0x3cf9f0, 513)) {
    if (sp === 0 || sp >= rom.length) continue;
    const scr = tryDecompress(rom, sp);
    if (scr === null) continue;
    scanScript(scr, { rom, subs, opts }, tables);
  }
  return tables;
};

export { scanDialogueTables };
