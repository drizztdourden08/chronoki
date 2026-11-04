/* @layer shared-asset-extraction @kind logic */
import { romRegion } from '../rom/rom-region';
import { hex } from './c-hex';
import { ANIMENG_E4_PC } from './animeng-pc-e4.constants';
import { STRIDE, PCS, PC, E3_HEAD, SHEET_HEAD } from './animeng-pc.constants';
import type { PcConfig } from './animeng-pc.type';

const sext = (b: number): number => (b >= 0x80 ? b - 256 : b);

const rec = (rom: Uint8Array, base: number, n: number): Uint8Array => romRegion(rom, base + n * STRIDE, base + n * STRIDE + STRIDE);
const positions = (r: Uint8Array): [number, number][] =>
  Array.from({ length: 4 }, (_, i) => [sext(r[0x20 + 2 * i] as number), sext(r[0x20 + 2 * i + 1] as number)]);
const cellwords = (r: Uint8Array): number[] => Array.from({ length: 16 }, (_, i) => (r[2 * i] as number) | ((r[2 * i + 1] as number) << 8));

const collectSrcs = (rom: Uint8Array, cfg: PcConfig): number[] => {
  const srcs = new Set<number>();
  for (const n of cfg.used) {
    for (const w of cellwords(rec(rom, cfg.base, n))) if (w & 0x07ff) srcs.add(w & 0x07ff);
  }
  return [...srcs].sort((a, b) => a - b);
};

const writeE3 = (rom: Uint8Array): string => {
  const o = [...E3_HEAD];
  for (const who of PCS) {
    const cfg = PC[who];
    o.push(`#define CT_ANIMENG_E3_${who.toUpperCase()}_N ${cfg.used.length}`);
    o.push(`static const CtAnimengPcRec ctAnimengE3${who}[CT_ANIMENG_E3_${who.toUpperCase()}_N] = {`);
    for (const n of cfg.used) {
      const r = rec(rom, cfg.base, n);
      const pos = positions(r).map(([dx, dy]) => `{${dx},${dy}},`).join(' ');
      const cws = cellwords(r).map((w) => `0x${hex(w, 4)},`).join(' ');
      o.push(`  { 0x${hex(n, 2)}, { ${pos} }, { ${cws} } },`);
    }
    o.push('};', '');
  }
  o.push('#endif', '');
  return o.join('\n');
};

const writeSheet = (rom: Uint8Array): string => {
  const o = [...SHEET_HEAD];
  for (const who of PCS) {
    const cfg = PC[who];
    const srcs = collectSrcs(rom, cfg);
    o.push(`#define CT_ANIMENG_SHEET_${who.toUpperCase()}_N ${srcs.length}`);
    o.push(`static const CtAnimengPcSheetTile ctAnimengSheet${who}[CT_ANIMENG_SHEET_${who.toUpperCase()}_N] = {`);
    for (const s of srcs) {
      const b = romRegion(rom, cfg.sheet + s * 0x20, cfg.sheet + s * 0x20 + 0x20);
      o.push(`  { 0x${hex(s, 3)}, {${Array.from(b, (x) => `0x${hex(x, 2)}`).join(',')}} },`);
    }
    o.push('};', '');
  }
  o.push('#endif', '');
  return o.join('\n');
};

const genAnimengPc = (rom: Uint8Array): Record<string, string> => ({
  'animeng_e3_pc.h': writeE3(rom),
  'animeng_sheet_pc.h': writeSheet(rom),
  'animeng_e4_pc.h': ANIMENG_E4_PC,
});

export { genAnimengPc };
