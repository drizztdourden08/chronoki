/* @layer shared-asset-extraction @kind logic */

const keystreamXor = (data: Uint8Array, seed: number): Uint8Array => {
  const out = new Uint8Array(data.length);
  let n = (0x19000000 + seed) >>> 0;
  for (let i = 0; i < data.length; i += 1) {
    n = (Math.imul(n, 0x41c64e6d) + 12345) >>> 0;
    out[i] = (data[i] as number) ^ (n >>> 24);
  }
  return out;
};

export { keystreamXor };
