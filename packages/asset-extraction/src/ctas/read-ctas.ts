/* @layer shared-asset-extraction @kind logic */
import type { CtasEntry } from './ctas.type';
import { readDirectory } from './read-directory';

const readCtas = (data: Uint8Array): CtasEntry[] =>
  readDirectory(data).map((e) => ({ type: e.type, id: e.id, blob: data.slice(e.offset, e.offset + e.length) }));

export { readCtas };
