/* @layer shared-asset-extraction @kind logic */
import {
  CHIP_FLIP_X,
  CHIP_FLIP_Y,
  CHIP_TILE_MASK,
  FRAME_HEADER_BYTES,
  PALETTE_BYTES,
  SPRITE_UNITS,
  SPR_H,
  SPR_OX,
  SPR_OY,
  SPR_W,
} from './party-sprites.constants';
import type { ComposedFrame } from './party-sprites.type';

const signed = (b: number): number => (b > 127 ? b - 256 : b);

const composeSpriteFrame = (blob: Uint8Array, frame: number): ComposedFrame | null => {
  if (blob.length < FRAME_HEADER_BYTES + PALETTE_BYTES) return null;
  const units = SPRITE_UNITS[(blob[0] as number) & 3] as number;
  const nframes = blob[1] as number;
  const ntiles = (blob[2] as number) | ((blob[3] as number) << 8);
  if (frame < 0 || frame >= nframes) return null;
  const tilesAt = FRAME_HEADER_BYTES + PALETTE_BYTES;
  const frameSize = units * 10;
  const frameAt = tilesAt + ntiles * 64 + frame * frameSize;
  if (blob.length < frameAt + frameSize) return null;
  const offsAt = frameAt + units * 8;
  const indices = new Uint8Array(SPR_W * SPR_H);
  const box: [number, number, number, number] = [SPR_W, SPR_H, -1, -1];
  for (let k = 0; k < units * 4; k += 1) {
    const chip = (blob[frameAt + k * 2] as number) | ((blob[frameAt + k * 2 + 1] as number) << 8);
    const src = chip & CHIP_TILE_MASK;
    if (src >= ntiles) continue;
    const fx = (chip & CHIP_FLIP_X) !== 0;
    const fy = (chip & CHIP_FLIP_Y) !== 0;
    const lx = k & 1 ? 8 : 0;
    const ly = k & 2 ? 8 : 0;
    const unit = k >> 2;
    const ox = signed(blob[offsAt + unit * 2] as number);
    const oy = signed(blob[offsAt + unit * 2 + 1] as number);
    const tileAt = tilesAt + src * 64;
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        const v = blob[tileAt + (fy ? 7 - y : y) * 8 + (fx ? 7 - x : x)] as number;
        if (!v) continue;
        const px = ox + lx + x + SPR_OX;
        const py = oy + ly + y + SPR_OY;
        if (px < 0 || px >= SPR_W || py < 0 || py >= SPR_H || indices[py * SPR_W + px]) continue;
        indices[py * SPR_W + px] = v;
        box[0] = Math.min(box[0], px);
        box[1] = Math.min(box[1], py);
        box[2] = Math.max(box[2], px);
        box[3] = Math.max(box[3], py);
      }
    }
  }
  return { indices, palette: blob.slice(FRAME_HEADER_BYTES, tilesAt), box };
};

export { composeSpriteFrame };
