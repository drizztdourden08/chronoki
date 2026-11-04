/* @layer shared-asset-extraction @kind logic */
import { readEntry } from './steam-archive';
import type { SteamArchive, SteamFiles } from './steam-archive.type';

const chipSet = async (archive: SteamArchive, files: SteamFiles, s: number): Promise<Uint8Array | null> => {
  const e = files.get(`Game/field/map_bin/cg${s}.bin`);
  if (!e) return null;
  const raw = (await readEntry(archive, e)).subarray(4);
  const sheet = new Uint8Array(raw.length * 2);
  for (let i = 0; i < raw.length; i += 1) {
    sheet[2 * i] = (raw[i] as number) >> 4;
    sheet[2 * i + 1] = (raw[i] as number) & 15;
  }
  const out = new Uint8Array(128 * 64);
  for (let c = 0; c < 128; c += 1) {
    const x = (c % 16) * 8;
    const y = Math.floor(c / 16) * 8;
    for (let r = 0; r < 8; r += 1) {
      const o = (y + r) * 128 + x;
      if (o + 8 <= sheet.length) out.set(sheet.subarray(o, o + 8), c * 64 + r * 8);
    }
  }
  return out;
};

const pixelSheet = async (archive: SteamArchive, files: SteamFiles, name: string): Promise<Uint8Array | null> => {
  const e = files.get(`Game/field/map_bin/${name}`);
  if (!e) return null;
  const d = await readEntry(archive, e);
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
  const ok = d.length >= 8 && dv.getUint32(0, true) === 256 && dv.getUint32(4, true) === 256 && d.length >= 8 + 65536;
  return ok ? d.slice(8, 8 + 65536) : null;
};

const MULTI_PAGES: Record<number, number> = { 0x6b: 3, 0xa5: 2, 0x1db: 2 };

const sheetPages = (loc: number): [number, string][] => {
  const count = MULTI_PAGES[loc];
  const pages: [number, string][] =
    count === undefined
      ? [[2, `cgext${loc}.bin`]]
      : Array.from({ length: count }, (_, k) => [2 + k, `cgext${loc}_${k}.bin`] as [number, string]);
  if (loc === 0x1c || loc === 0x15b) pages.push([1, 'cg_bg.bin']);
  if ((loc >= 0x15a && loc <= 0x15e) || (loc >= 0x1c8 && loc <= 0x1cb)) pages.push([2, 'cgext_lavos.bin']);
  return pages;
};

const steamPalette = async (archive: SteamArchive, files: SteamFiles, loc: number): Promise<Uint8Array | null> => {
  const info = files.get(`Game/field/Mapinfo/mapinfo_${loc}.dat`);
  if (!info) return null;
  const header = await readEntry(archive, info);
  const id = new DataView(header.buffer, header.byteOffset, header.byteLength).getUint16(10, true);
  const e = files.get(`Game/field/palette_bin/plt${id}.bin`);
  if (!e) return null;
  const d = await readEntry(archive, e);
  const ok = d.length >= 2 + 512 && new DataView(d.buffer, d.byteOffset, d.byteLength).getUint16(0, true) === 0x100;
  return ok ? d.slice(2, 2 + 256) : null;
};

export { chipSet, pixelSheet, sheetPages, steamPalette };
