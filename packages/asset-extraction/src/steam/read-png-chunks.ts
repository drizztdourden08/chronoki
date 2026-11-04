/* @layer shared-asset-extraction @kind logic */
import type { PngChunks } from './png-chunks.type';

const readPngChunks = (data: Uint8Array): PngChunks => {
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const png: PngChunks = { idat: [], plte: new Uint8Array(0), trns: new Uint8Array(0), w: 0, h: 0, depth: 0, ctype: 0 };
  for (let o = 8; o + 8 <= data.length; ) {
    const n = dv.getUint32(o, false);
    const typ = String.fromCharCode(...data.subarray(o + 4, o + 8));
    const body = data.subarray(o + 8, o + 8 + n);
    o += 12 + n;
    if (typ === 'IHDR') {
      const bv = new DataView(body.buffer, body.byteOffset, body.byteLength);
      [png.w, png.h, png.depth, png.ctype] = [bv.getUint32(0, false), bv.getUint32(4, false), body[8] as number, body[9] as number];
    } else if (typ === 'PLTE') png.plte = body;
    else if (typ === 'tRNS') png.trns = body;
    else if (typ === 'IDAT') png.idat.push(body);
  }
  return png;
};

export { readPngChunks };
