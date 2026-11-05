/* @layer shared-asset-extraction @kind logic */
import { drawChip } from './draw-chip';
import {
  FRAME_HEADER_BYTES,
  PALETTE_BYTES,
  SPRITE_UNITS,
  SPR_H,
  SPR_W,
} from './party-sprites.constants';
import type { ComposedFrame } from './party-sprites.type';

const byteOf = (blob: Uint8Array, at: number): number => blob[at] ?? 0;

const composeSpriteFrame = (blob: Uint8Array, frame: number): ComposedFrame | null => {
  if (blob.length < FRAME_HEADER_BYTES + PALETTE_BYTES) return null;
  const units = SPRITE_UNITS[byteOf(blob, 0) & 3] ?? 0;
  const nframes = byteOf(blob, 1);
  const ntiles = byteOf(blob, 2) | (byteOf(blob, 3) << 8);
  if (frame < 0 || frame >= nframes) return null;
  const tilesAt = FRAME_HEADER_BYTES + PALETTE_BYTES;
  const frameSize = units * 10;
  const frameAt = tilesAt + ntiles * 64 + frame * frameSize;
  if (blob.length < frameAt + frameSize) return null;
  const indices = new Uint8Array(SPR_W * SPR_H);
  const box: [number, number, number, number] = [SPR_W, SPR_H, -1, -1];
  const layout = { blob, tilesAt, ntiles, frameAt, offsAt: frameAt + units * 8, indices, box };
  for (let k = 0; k < units * 4; k += 1) drawChip(layout, k);
  return { indices, palette: blob.slice(FRAME_HEADER_BYTES, tilesAt), box };
};

export { composeSpriteFrame };
