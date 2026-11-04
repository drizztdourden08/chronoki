/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from './ctas.type';
import { readDirectory } from './read-directory';

const readCtas = (data: Uint8Array): CtasEntry[] =>
  readDirectory(data).map((e) => ({ type: e.type, id: e.id, blob: data.slice(e.offset, e.offset + e.length) }));

const ctasVersion = (data: Uint8Array): number =>
  new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(4, true);

export { ctasVersion, readCtas };
