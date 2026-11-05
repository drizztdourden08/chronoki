/* @layer renderer-components @kind logic */
import type { CkCanvasSize, CkViewCalls } from '@chronoki/game-core';
import { viewBlackOf, viewOriginOf } from '@chronoki/game-core';
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { chestMarkersHolder } from '@app/game/qol/chest-markers-holder';
import {
  BASE_VIEW_HEIGHT, BASE_VIEW_WIDTH, EXPORT_VIEW_HEIGHT, EXPORT_VIEW_WIDTH, LOCATION_MASK, LOCATION_WRAM, MARKER_LIFT_PX,
  MARKER_SIZE_PX, TILE_PX,
} from '../TierMarkerLayer.constants';
import type { TierMarkerSpot } from '../TierMarkerLayer.type';

const hasExtent = (calls: CkViewCalls): boolean => calls.has(EXPORT_VIEW_WIDTH) && calls.has(EXPORT_VIEW_HEIGHT);

const tierSpotsOf = (calls: CkViewCalls | null, view: MemoryView | null, canvas: CkCanvasSize): TierMarkerSpot[] => {
  if (!calls || !view || !hasExtent(calls) || !viewBlackOf(calls, canvas)?.field) return [];
  const origin = viewOriginOf(calls);
  const viewWidth = calls.number(EXPORT_VIEW_WIDTH);
  const viewHeight = calls.number(EXPORT_VIEW_HEIGHT);
  if (!origin || viewWidth <= 0 || viewHeight <= 0) return [];
  const scaleX = canvas.width / viewWidth;
  const scaleY = canvas.height / viewHeight;
  const marginX = (viewWidth - BASE_VIEW_WIDTH) / 2;
  const marginY = (viewHeight - BASE_VIEW_HEIGHT) / 2;
  const markers = chestMarkersHolder.markers.get(view.word('wram', LOCATION_WRAM) & LOCATION_MASK) ?? [];
  return markers
    .filter((m) => (view.byte('wram', m.opened.offset) & m.opened.mask) === 0)
    .map((m) => ({
      tier: m.tier,
      x: (m.x * TILE_PX + TILE_PX / 2 - origin.x + marginX) * scaleX,
      y: (m.y * TILE_PX - MARKER_LIFT_PX - origin.y + marginY) * scaleY,
      size: MARKER_SIZE_PX * scaleY,
    }));
};

export { tierSpotsOf };
