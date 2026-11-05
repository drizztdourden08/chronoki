/* @layer shared-asset-extraction @kind logic */
import { drawTile } from './draw-tile';
import { CHIP_FLIP_X, CHIP_FLIP_Y, CHIP_TILE_MASK } from './party-sprites.constants';
import type { FrameLayout } from './frame-layout.type';

const byteOf = (blob: Uint8Array, at: number): number => blob[at] ?? 0;
const signed = (b: number): number => (b > 127 ? b - 256 : b);

const drawChip = (layout: FrameLayout, k: number): void => {
  const { blob, tilesAt, ntiles, frameAt, offsAt } = layout;
  const chip = byteOf(blob, frameAt + k * 2) | (byteOf(blob, frameAt + k * 2 + 1) << 8);
  const src = chip & CHIP_TILE_MASK;
  if (src >= ntiles) return;
  const unit = k >> 2;
  drawTile(layout, {
    tileAt: tilesAt + src * 64,
    flipX: (chip & CHIP_FLIP_X) !== 0,
    flipY: (chip & CHIP_FLIP_Y) !== 0,
    originX: signed(byteOf(blob, offsAt + unit * 2)) + (k & 1 ? 8 : 0),
    originY: signed(byteOf(blob, offsAt + unit * 2 + 1)) + (k & 2 ? 8 : 0),
  });
};

export { drawChip };
