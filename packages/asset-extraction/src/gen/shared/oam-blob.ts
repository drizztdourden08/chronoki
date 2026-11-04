/* @layer shared-asset-extraction @kind logic */
import { OAM_SIZE } from './oam-decode.constants';

const oamBlob = (sidecar: Uint8Array): Uint8Array => {
  if (sidecar.length === OAM_SIZE) return sidecar;
  if (sidecar.length !== 1056 && sidecar.length !== 1568) {
    throw new Error(`not a 544/1056/1568-byte .oam sidecar (${sidecar.length} bytes)`);
  }
  const out = new Uint8Array(OAM_SIZE);
  out.set(sidecar.subarray(0, 512), 0);
  out.set(sidecar.subarray(1024, 1056), 512);
  return out;
};

export { oamBlob };
