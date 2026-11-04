/* @layer shared-asset-extraction @kind logic */
import { COPIER_HEADER_BYTES } from './rom.constants';

const hasCopierHeader = (data: Uint8Array): boolean => data.length % 1024 === COPIER_HEADER_BYTES;

export { hasCopierHeader };
