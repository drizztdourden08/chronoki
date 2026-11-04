/* @layer shared-asset-extraction @kind logic */
import { COPIER_HEADER_BYTES } from './rom.constants';

/** ctlib/rom.py load(): a file whose size is 512 mod 1024 carries a copier header; drop it. */
const hasCopierHeader = (data: Uint8Array): boolean => data.length % 1024 === COPIER_HEADER_BYTES;

const normalizeRom = (data: Uint8Array): Uint8Array =>
  hasCopierHeader(data) ? data.subarray(COPIER_HEADER_BYTES) : data;

export { hasCopierHeader, normalizeRom };
