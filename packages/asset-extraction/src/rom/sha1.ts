/* @layer shared-asset-extraction @kind logic */
const rotl = (x: number, n: number): number => ((x << n) | (x >>> (32 - n))) >>> 0;

const padded = (data: Uint8Array): DataView => {
  const total = ((data.length + 9 + 63) >> 6) << 6;
  const buf = new Uint8Array(total);
  buf.set(data);
  buf[data.length] = 0x80;
  const view = new DataView(buf.buffer);
  const bits = data.length * 8;
  view.setUint32(total - 8, Math.floor(bits / 0x100000000));
  view.setUint32(total - 4, bits >>> 0);
  return view;
};

const roundOf = (t: number, b: number, c: number, d: number): [number, number] => {
  if (t < 20) return [(b & c) | (~b & d), 0x5a827999];
  if (t < 40) return [b ^ c ^ d, 0x6ed9eba1];
  if (t < 60) return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
  return [b ^ c ^ d, 0xca62c1d6];
};

/** SHA-1 as lower-case hex, in plain TypeScript so the same code runs in Node and in a web worker. */
const sha1Hex = (data: Uint8Array): string => {
  const view = padded(data);
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  const w = new Uint32Array(80);
  for (let off = 0; off < view.byteLength; off += 64) {
    for (let t = 0; t < 16; t += 1) w[t] = view.getUint32(off + t * 4);
    for (let t = 16; t < 80; t += 1) w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
    let [a, b, c, d, e] = h;
    for (let t = 0; t < 80; t += 1) {
      const [f, k] = roundOf(t, b, c, d);
      const next = (rotl(a, 5) + (f >>> 0) + e + k + w[t]) >>> 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = next;
    }
    h[0] = (h[0] + a) >>> 0;
    h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0;
    h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0;
  }
  return h.map((x) => x.toString(16).padStart(8, '0')).join('');
};

export { sha1Hex };
