/* @layer shared-asset-extraction @kind logic */
import { readEntry } from './steam-archive';
import type { SteamArchive, SteamFiles } from './steam-archive.type';

const pixelSheet = async (archive: SteamArchive, files: SteamFiles, name: string): Promise<Uint8Array | null> => {
  const e = files.get(`Game/field/map_bin/${name}`);
  if (!e) return null;
  const d = await readEntry(archive, e);
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
  const ok = d.length >= 8 && dv.getUint32(0, true) === 256 && dv.getUint32(4, true) === 256 && d.length >= 8 + 65536;
  return ok ? d.slice(8, 8 + 65536) : null;
};

export { pixelSheet };
