/* @layer shared-asset-extraction @kind logic */
import { COPIER_HEADER_BYTES } from './rom.constants';

const hasCopierHeader = (data: Uint8Array): boolean => data.length % 1024 === COPIER_HEADER_BYTES;

const normalizeRom = (data: Uint8Array): Uint8Array =>
  hasCopierHeader(data) ? data.subarray(COPIER_HEADER_BYTES) : data;

export { hasCopierHeader, normalizeRom };
