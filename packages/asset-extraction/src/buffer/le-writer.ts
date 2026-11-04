/* @layer shared-asset-extraction @kind logic */
interface LeWriter {
  u8: (v: number) => void;
  u16: (v: number) => void;
  u32: (v: number) => void;
  u64: (v: bigint) => void;
  i64: (v: bigint) => void;
  /** An unsigned integer of `size` bytes (4 or 8 for a pointer), little-endian. */
  uint: (v: bigint, size: number) => void;
  bytes: (b: Uint8Array) => void;
  zeros: (n: number) => void;
  length: () => number;
  toBytes: () => Uint8Array;
}

/** The little-endian byte sink the container and pack formats are written through (Python's struct.pack + +=). */
const createLeWriter = (): LeWriter => {
  const chunks: Uint8Array[] = [];
  let total = 0;
  const push = (b: Uint8Array): void => {
    chunks.push(b);
    total += b.length;
  };
  const uint = (v: bigint, size: number): void => {
    const b = new Uint8Array(size);
    let rest = BigInt.asUintN(size * 8, v);
    for (let i = 0; i < size; i += 1) {
      b[i] = Number(rest & 0xffn);
      rest >>= 8n;
    }
    push(b);
  };
  return {
    u8: (v) => uint(BigInt(v), 1),
    u16: (v) => uint(BigInt(v), 2),
    u32: (v) => uint(BigInt(v), 4),
    u64: (v) => uint(v, 8),
    i64: (v) => uint(v, 8),
    uint,
    bytes: (b) => push(b),
    zeros: (n) => push(new Uint8Array(n)),
    length: () => total,
    toBytes: () => {
      const out = new Uint8Array(total);
      let at = 0;
      for (const c of chunks) {
        out.set(c, at);
        at += c.length;
      }
      return out;
    },
  };
};

export { createLeWriter };
export type { LeWriter };
