/* @layer renderer-lib @kind logic */
import type { PackEntry } from './title-pendulum.type';
import { PACK_DIR_BYTES, PACK_HEADER_BYTES, PACK_MAGIC } from './title-pendulum.constants';

const decoder = new TextDecoder();

const entryAt = (view: DataView, index: number): PackEntry | null => {
  const dir = PACK_HEADER_BYTES + PACK_DIR_BYTES * index;
  if (dir + PACK_DIR_BYTES > view.byteLength) return null;
  const entry = { type: view.getUint32(dir, true), at: view.getUint32(dir + 8, true), length: view.getUint32(dir + 12, true) };
  return entry.at + entry.length <= view.byteLength ? entry : null;
};

const packEntries = (bytes: Uint8Array): PackEntry[] | null => {
  if (bytes.length < PACK_HEADER_BYTES || decoder.decode(bytes.subarray(0, 4)) !== PACK_MAGIC) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const entries = Array.from({ length: view.getUint32(8, true) }, (_, index) => entryAt(view, index));
  return entries.every((entry): entry is PackEntry => entry !== null) ? entries : null;
};

export { packEntries };
