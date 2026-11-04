/* @layer shared-asset-extraction @kind logic */
import { readEntry } from './steam-archive';
import type { SteamArchive, SteamFiles } from './steam-archive.type';

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

export { steamPalette };
