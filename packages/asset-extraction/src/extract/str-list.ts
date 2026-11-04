/* @layer shared-asset-extraction @kind logic @source Python extract_assets._strlist */
import { createLeWriter } from '../buffer/le-writer';

const encoder = new TextEncoder();

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
