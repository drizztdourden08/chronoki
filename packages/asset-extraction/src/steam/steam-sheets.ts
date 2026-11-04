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

export { chipSet };
