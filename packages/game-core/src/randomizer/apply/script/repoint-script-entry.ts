/* @layer bridge-wasm @kind logic */
import { CTAS_ENTRY_BYTES, CTAS_HEADER_BYTES } from '../../checks/checks.constants';
import { readPackEntries } from '../../checks/read-pack-entries';
import type { PackEntry } from '../../checks/read-pack-entries.type';
import { CTAS_TYPE_LZ, LZ_DATA_AT } from '../apply.constants';

const word = (d: Uint8Array, o: number): number =>
  ((d[o] ?? 0) | ((d[o + 1] ?? 0) << 8) | ((d[o + 2] ?? 0) << 16) | ((d[o + 3] ?? 0) << 24)) >>> 0;

const putWord = (d: Uint8Array, o: number, v: number): void => {
  for (let i = 0; i < 4; i += 1) d[o + i] = (v >>> (i * 8)) & 0xff;
};

const rowOf = (pack: Uint8Array, e: PackEntry): number => {
  for (let i = 0, n = word(pack, 8); i < n; i += 1) {
    const at = CTAS_HEADER_BYTES + i * CTAS_ENTRY_BYTES;
    if (word(pack, at) === e.type && word(pack, at + 4) === e.id && word(pack, at + 8) === e.start) return at;
  }
  return -1;
};

const isCopy = (pack: Uint8Array, e: PackEntry, script: PackEntry): boolean => {
  if (e.type !== CTAS_TYPE_LZ || e.length !== LZ_DATA_AT + script.length || word(pack, e.start) !== script.length) return false;
  for (let i = 0; i < script.length; i += 1) if (pack[e.start + LZ_DATA_AT + i] !== pack[script.start + i]) return false;
  return true;
};

const blobFor = (pack: Uint8Array, e: PackEntry, script: PackEntry, raw: Uint8Array): Uint8Array => {
  if (e === script) return raw;
  const blob = new Uint8Array(LZ_DATA_AT + raw.length);
  blob.set(pack.subarray(e.start, e.start + LZ_DATA_AT));
  putWord(blob, 0, raw.length);
  blob.set(raw, LZ_DATA_AT);
  return blob;
};

const repointScriptEntry = (pack: Uint8Array, script: PackEntry, raw: Uint8Array): Uint8Array | null => {
  const targets = [script, ...readPackEntries(pack).filter((e) => isCopy(pack, e, script))];
  const rows = targets.map((e) => rowOf(pack, e));
  if (rows.some((r) => r < 0)) return null;
  const blobs = targets.map((e) => blobFor(pack, e, script, raw));
  const out = new Uint8Array(pack.length + blobs.reduce((n, b) => n + b.length, 0));
  out.set(pack);
  let at = pack.length;
  blobs.forEach((b, i) => {
    out.set(b, at);
    putWord(out, (rows[i] ?? 0) + 8, at);
    putWord(out, (rows[i] ?? 0) + 12, b.length);
    at += b.length;
  });
  return out;
};

export { repointScriptEntry };
