/* @layer bridge-wasm @kind logic */
import { CKST_LENGTH_BYTES, CKST_MAGIC, CKST_VERSION, CKST_LEGACY_VERSION } from './ck-state.constants';
import { upgradeLegacyState } from './upgrade-legacy-state';

const engineStateOf = (bytes: Uint8Array): Uint8Array | null => {
  if (bytes.length < CKST_LENGTH_BYTES * 2) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (new TextDecoder().decode(bytes.subarray(0, CKST_LENGTH_BYTES)) !== CKST_MAGIC) return null;
  const version = view.getUint32(CKST_LENGTH_BYTES, true);
  if (version === CKST_VERSION) return bytes;
  return version === CKST_LEGACY_VERSION ? upgradeLegacyState(bytes) : null;
};

export { engineStateOf };
