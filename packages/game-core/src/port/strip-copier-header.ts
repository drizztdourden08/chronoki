/* @layer bridge-wasm @kind logic */
import { COPIER_HEADER_BYTES, COPIER_HEADER_MODULO } from './chronoki-port.constants';

const stripCopierHeader = (bytes: Uint8Array): Uint8Array =>
  bytes.length % COPIER_HEADER_MODULO === COPIER_HEADER_BYTES ? bytes.subarray(COPIER_HEADER_BYTES) : bytes;

export { stripCopierHeader };
