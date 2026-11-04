/* @layer shared-asset-extraction @kind logic */
import { inflate } from './inflate';
import { paintRow } from './paint-row';
import { readPngChunks } from './read-png-chunks';
import type { Rgba } from './steam-image.type';
import { PNG_MAGIC, CHANNELS } from './steam-image.constants';
import { unfilter } from './unfilter';

const pngRgba = async (data: Uint8Array): Promise<Rgba | null> => {
  if (PNG_MAGIC.some((m, i) => data[i] !== m)) return null;
  const png = readPngChunks(data);
  const ch = CHANNELS[png.ctype];
  if (png.depth !== 8 || ch === undefined) return null;
  const joined = new Uint8Array(png.idat.reduce((s, c) => s + c.length, 0));
  png.idat.reduce((at, c) => (joined.set(c, at), at + c.length), 0);
  const rows = unfilter(await inflate(joined, 'deflate'), png.w, png.h, ch);
  const px = new Uint8Array(png.w * png.h * 4);
  rows.forEach((line, y) => paintRow(px, line, y, png));
  return { w: png.w, h: png.h, px };
};

export { pngRgba };
