/* @layer shared-asset-extraction @kind logic */
import type { SteamArchive } from './steam-archive.type';
import { inflate } from './inflate';
import { keystreamXor } from './keystream-xor';

const readBlock = async (archive: SteamArchive, off: number, size: number): Promise<Uint8Array> => {
  const d = keystreamXor(await archive.read(off, size), off);
  const length = new DataView(d.buffer, d.byteOffset, 4).getUint32(0, false);
  return (await inflate(d.subarray(4), 'gzip')).subarray(0, length);
};

export { readBlock };
