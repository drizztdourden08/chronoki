/* @layer shared-asset-extraction @kind logic */
/** Random access to the player's Steam `resources.bin` (the host opens the file; it can be larger than memory). */
interface SteamArchive {
  read: (offset: number, length: number) => Promise<Uint8Array>;
}

/** An entry of the archive's directory: [file offset, stored size]. */
type SteamFiles = Map<string, [number, number]>;

/** steam_wide.py _keystream_xor: a block XORed with an LCG keystream seeded by the block's file offset. */
const keystreamXor = (data: Uint8Array, seed: number): Uint8Array => {
  const out = new Uint8Array(data.length);
  let n = (0x19000000 + seed) >>> 0;
  for (let i = 0; i < data.length; i += 1) {
    n = (Math.imul(n, 0x41c64e6d) + 12345) >>> 0;
    out[i] = (data[i] as number) ^ (n >>> 24);
  }
  return out;
};

/** Inflates a gzip (the archive's blocks) or zlib (PNG) stream. */
const inflate = async (data: Uint8Array, format: 'gzip' | 'deflate'): Promise<Uint8Array> => {
  const stream = new Blob([new Uint8Array(data)]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

/** steam_wide.py _block: the big-endian length, then the gzip, of the XORed block at `off`. */
const readBlock = async (archive: SteamArchive, off: number, size: number): Promise<Uint8Array> => {
  const d = keystreamXor(await archive.read(off, size), off);
  const length = new DataView(d.buffer, d.byteOffset, 4).getUint32(0, false);
  return (await inflate(d.subarray(4), 'gzip')).subarray(0, length);
};

const readEntry = (archive: SteamArchive, entry: [number, number]): Promise<Uint8Array> =>
  readBlock(archive, entry[0], entry[1]);

/** steam_wide.py directory(): the ARC1 header, then the gzip block of (name offset, file offset, size) records. */
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

export { inflate, keystreamXor, readBlock, readDirectory, readEntry };
export type { SteamArchive, SteamFiles };
