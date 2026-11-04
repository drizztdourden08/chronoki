/* @layer shared-asset-extraction @kind logic */
import { u16 } from '../extract/rom-read';
import { LOC_RECORDS, TILESET_LISTS } from './closure-locations.constants';

const addTilesetList = (rom: Uint8Array, tileset: number, idxs: Set<number>): void => {
  for (let i = 0; i < 8; i += 1) {
    const ix = rom[TILESET_LISTS + tileset * 8 + i] as number;
    if (ix !== 0xff) idxs.add(ix);
  }
};

const locationIndices = (rom: Uint8Array) => {
  const ts = new Set<number>();
  const b3s = new Set<number>();
  const idxs = new Set<number>();
  const maps = new Set<number>();
  const scripts = new Set<number>();
  for (let loc = 0; loc < 512; loc += 1) {
    const r = LOC_RECORDS + loc * 14;
    const t = rom[r + 1] as number;
    const b3 = rom[r + 2] as number;
    if (t !== 0xff) {
      ts.add(t);
      addTilesetList(rom, t, idxs);
    }
    if (b3 !== 0xff) b3s.add(b3);
    maps.add(u16(rom, r + 4));
    scripts.add(u16(rom, r + 8));
  }
  return { ts, b3s, idxs, maps, scripts };
};

export { locationIndices };
