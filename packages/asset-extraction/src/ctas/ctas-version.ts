/* @layer shared-asset-extraction @kind logic */

const ctasVersion = (data: Uint8Array): number =>
  new DataView(data.buffer, data.byteOffset, data.byteLength).getUint32(4, true);

export { ctasVersion };
