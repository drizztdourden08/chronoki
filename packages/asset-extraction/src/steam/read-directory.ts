/* @layer shared-asset-extraction @kind logic */
import type { SteamArchive, SteamFiles } from './steam-archive.type';
import { keystreamXor } from './keystream-xor';
import { readBlock } from './read-block';

const readDirectory = async (archive: SteamArchive): Promise<SteamFiles> => {
  const h = keystreamXor(await archive.read(0, 16), 0);
  if (String.fromCharCode(...h.subarray(0, 4)) !== 'ARC1') {
    throw new Error("not the Steam release's resources.bin (no ARC1 header)");
  }
  const hv = new DataView(h.buffer, h.byteOffset, 16);
  const d = await readBlock(archive, hv.getUint32(8, true), hv.getUint32(12, true));
  const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
  const files: SteamFiles = new Map();
  const decoder = new TextDecoder('utf-8');
  const count = dv.getUint32(0, true);
  for (let k = 0; k < count; k += 1) {
    const base = 4 + 12 * k;
    const po = dv.getUint32(base, true);
    files.set(decoder.decode(d.subarray(po, d.indexOf(0, po))), [dv.getUint32(base + 4, true), dv.getUint32(base + 8, true)]);
  }
  return files;
};

export { readDirectory };
