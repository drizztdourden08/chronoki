/* @layer shared-asset-extraction @kind logic */
import { COPIER_HEADER_BYTES } from './rom.constants';
import { hasCopierHeader } from './has-copier-header';

const normalizeRom = (data: Uint8Array): Uint8Array =>
  hasCopierHeader(data) ? data.subarray(COPIER_HEADER_BYTES) : data;

export { normalizeRom };
