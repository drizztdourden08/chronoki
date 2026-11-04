/* @layer shared-asset-extraction @kind logic */
import { readEntry } from './steam-archive';
import type { SteamArchive, SteamFiles } from './steam-archive';
import { sheetPages } from './steam-sheets';

const LOCATIONS = 0x200;

interface Metatile {
  t: number;
  corners: [number, number, number][];
}

interface Margin {
  w: number;
  h: number;
  planes: Uint8Array;
  slots: number[];
  metas: Metatile[];
  pages: [number, string][];
}

const u16s = (b: Uint8Array): Uint16Array => {
  const out = new Uint16Array(b.length >> 1);
  for (let i = 0; i < out.length; i += 1) out[i] = (b[2 * i] as number) | ((b[2 * i + 1] as number) << 8);
  return out;
};

const metatiles = (asm: Uint8Array, planes: Uint8Array): Metatile[] => {
  const ids = [...new Set(Array.from(u16s(planes)).filter((v) => v > 0 && v <= 512).map((v) => v - 1))].sort((a, b) => a - b);
  const metas: Metatile[] = [];
  for (const t of ids) {
    if ((t + 1) * 12 > asm.length) continue;
    const corners: [number, number, number][] = [];
    for (let k = 0; k < 4; k += 1) {
      const o = (t * 4 + k) * 3;
      const v = (asm[o] as number) | ((asm[o + 1] as number) << 8);
      const flags = (v & 0x400 ? 1 : 0) | (v & 0x800 ? 2 : 0) | ((asm[o + 2] as number) & 1 ? 4 : 0);
      corners.push([v & 0x3ff, (v >> 12) & 15, flags]);
    }
    metas.push({ t, corners });
  }
  return metas;
};

const withFifthPlane = (d: Uint8Array, w: number, h: number): Uint8Array | null => {
  const planes = d.slice(2, 2 + 8 * w * h);
  if (planes.length !== 8 * w * h || !planes.some((b) => b !== 0)) return null;
  const o = 2 + 8 * w * h;
  const has = d.length >= o + 2 + 2 * w * h && ((d[o] as number) | (d[o + 1] as number)) !== 0;
  const out = new Uint8Array(10 * w * h);
  out.set(planes, 0);
  if (has) out.set(d.subarray(o + 2, o + 2 + 2 * w * h), 8 * w * h);
  return out;
};

const readMargins = async (archive: SteamArchive, files: SteamFiles): Promise<Map<number, Margin>> => {
  const out = new Map<number, Margin>();
  for (let loc = 0; loc < LOCATIONS; loc += 1) {
    const e = files.get(`Game/field/mapext_bin/mapext_${loc}.bin`);
    const info = files.get(`Game/field/Mapinfo/mapinfo_${loc}.dat`);
    if (!e || !info) continue;
    const d = await readEntry(archive, e);
    const w = d[0] as number;
    const h = d[1] as number;
    const planes = withFifthPlane(d, w, h);
    if (planes === null) continue;
    const header = await readEntry(archive, info);
    const hv = new DataView(header.buffer, header.byteOffset, header.byteLength);
    const tileset = hv.getUint16(2, true);
    const assembly = hv.getUint16(4, true);
    const bs = files.get(`Game/field/BGSetTable/bgsettable_${tileset}.dat`);
    const slots = bs ? Array.from((await readEntry(archive, bs)).subarray(0, 6)) : Array(6).fill(0xff);
    const ce = files.get(`Game/field/ChipTable/ChipTable_${String(assembly).padStart(4, '0')}.dat`);
    const asm = ce ? await readEntry(archive, ce) : new Uint8Array(0);
    out.set(loc, { w, h, planes, slots, metas: metatiles(asm, planes), pages: sheetPages(loc) });
  }
  return out;
};

export { readMargins };
export type { Margin, Metatile };
