/* @layer shared-asset-extraction @kind logic */
import { createLeWriter } from '../buffer/le-writer';

const encoder = new TextEncoder();

/** extract_assets._strlist: [count u16][ {u16 len, UTF-8 bytes} ... ], each string cut at 0xFFFF bytes. */
const strList = (strings: string[]): Uint8Array => {
  const b = createLeWriter();
  b.u16(strings.length);
  for (const s of strings) {
    const u = encoder.encode(s).slice(0, 0xffff);
    b.u16(u.length);
    b.bytes(u);
  }
  return b.toBytes();
};

export { strList };
