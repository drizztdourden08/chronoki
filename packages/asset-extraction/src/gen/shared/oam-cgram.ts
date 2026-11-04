/* @layer shared-asset-extraction @kind logic */
const oamCgram = (sidecar: Uint8Array): Uint8Array | null =>
  sidecar.length === 1568 ? sidecar.slice(1056, 1568) : null;

export { oamCgram };
