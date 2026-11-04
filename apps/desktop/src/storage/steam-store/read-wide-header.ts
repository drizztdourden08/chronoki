/* @layer renderer-lib @kind logic */
import { WIDE_HEADER_BYTES, WIDE_MAGIC } from './steam-store.constants';
import type { WideHeader } from './steam-store.type';

const readWideHeader = (bytes: Uint8Array): WideHeader | null => {
  if (bytes.length < WIDE_HEADER_BYTES) return null;
  const magic = String.fromCharCode(...bytes.subarray(0, WIDE_MAGIC.length));
  if (magic !== WIDE_MAGIC) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, WIDE_HEADER_BYTES);
  return { version: view.getUint32(4, true), margins: view.getUint32(8, true) };
};

export { readWideHeader };
