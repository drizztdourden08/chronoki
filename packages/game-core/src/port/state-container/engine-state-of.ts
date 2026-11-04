/* @layer bridge-wasm @kind logic */
import { CKST_LENGTH_BYTES, CKST_MAGIC, CKST_VERSION, CKST_VERSION_V1 } from './ck-state.constants';
import { upgradeCkStateV1 } from './upgrade-ck-state-v1';

const engineStateOf = (bytes: Uint8Array): Uint8Array | null => {
  if (bytes.length < CKST_LENGTH_BYTES * 2) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (new TextDecoder().decode(bytes.subarray(0, CKST_LENGTH_BYTES)) !== CKST_MAGIC) return null;
  const version = view.getUint32(CKST_LENGTH_BYTES, true);
  if (version === CKST_VERSION) return bytes;
  return version === CKST_VERSION_V1 ? upgradeCkStateV1(bytes) : null;
};

export { engineStateOf };
