/* @layer shared-asset-extraction @kind logic */
import { SPR_H, SPR_OX, SPR_OY, SPR_W } from './party-sprites.constants';
import type { FrameLayout, TilePlacement } from './frame-layout.type';

const drawPixel = (layout: FrameLayout, px: number, py: number, value: number): void => {
  const { indices, box } = layout;
  if (px < 0 || px >= SPR_W || py < 0 || py >= SPR_H || indices[py * SPR_W + px]) return;
  indices[py * SPR_W + px] = value;
  box[0] = Math.min(box[0], px);
  box[1] = Math.min(box[1], py);
  box[2] = Math.max(box[2], px);
  box[3] = Math.max(box[3], py);
};

const drawTile = (layout: FrameLayout, place: TilePlacement): void => {
  const { tileAt, flipX, flipY, originX, originY } = place;
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      const value = layout.blob[tileAt + (flipY ? 7 - y : y) * 8 + (flipX ? 7 - x : x)] ?? 0;
      if (value) drawPixel(layout, originX + x + SPR_OX, originY + y + SPR_OY, value);
    }
  }
};

export { drawTile };
