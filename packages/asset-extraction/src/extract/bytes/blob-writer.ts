/* @layer shared-asset-extraction @kind logic */

import type { BlobWriter } from './blob-writer.type';


const createBlobWriter = (): BlobWriter => {
  let buf = new Uint8Array(256);
  let len = 0;
  const room = (n: number): void => {
    if (len + n <= buf.length) return;
    const next = new Uint8Array(Math.max(buf.length * 2, len + n));
    next.set(buf.subarray(0, len));
    buf = next;
  };
  const put = (v: number, size: number): void => {
    room(size);
    for (let i = 0; i < size; i += 1) buf[len + i] = Math.floor(v / 2 ** (8 * i)) & 0xff;
    len += size;
  };
  return {
    u8: (v) => put(v, 1),
    u16: (v) => put(v, 2),
    i16: (v) => put(v, 2),
    u32: (v) => put(v, 4),
    i32: (v) => put(v, 4),
    bytes: (b) => {
      room(b.length);
      for (let i = 0; i < b.length; i += 1) buf[len + i] = b[i] as number;
      len += b.length;
    },
    toBytes: () => buf.slice(0, len),
  };
};

const concatBytes = (parts: readonly ArrayLike<number>[]): Uint8Array => {
  const w = createBlobWriter();
  for (const p of parts) w.bytes(p);
  return w.toBytes();
};

export { concatBytes, createBlobWriter };
export type { BlobWriter };
