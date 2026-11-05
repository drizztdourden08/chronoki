/* @layer renderer-components @kind hook */
import { hostGate } from '@chronoki/game-core';
import { chronokiCore } from '@app/game/lifecycle';
import { chronokiRawMemoryBridge } from '@app/game/randomizer/chronoki-raw-memory-bridge';
import { useCanvasOverlayLoop } from '../../../behavior/useCanvasOverlayLoop';
import { drawTierMarker } from '../draw-tier-marker';
import { LIVE_STATUSES, TIER_MARKER_GATE } from '../TierMarkerLayer.constants';
import type { MarkerPainter, TierMarkerLayerProps } from '../TierMarkerLayer.type';
import { tierSpotsOf } from './tier-spots-of';

const useChestMarkers = (props: TierMarkerLayerProps & { markerCanvasRef: TierMarkerLayerProps['gameCanvasRef'] }): void => {
  const { status, gameCanvasRef, markerCanvasRef } = props;

  useCanvasOverlayLoop<MarkerPainter>({
    live: LIVE_STATUSES.includes(status),
    gameCanvasRef,
    fxCanvasRef: markerCanvasRef,
    createRenderer: (canvas) => {
      const ctx = canvas.getContext('2d');
      return ctx ? { ctx, dispose: () => undefined } : null;
    },
    onStart: () => undefined,
    onFrame: ({ renderer, gameCanvas, fxCanvas, time }) => {
      if (fxCanvas.width !== gameCanvas.width || fxCanvas.height !== gameCanvas.height) {
        fxCanvas.width = gameCanvas.width;
        fxCanvas.height = gameCanvas.height;
      }
      renderer.ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      if (!hostGate(TIER_MARKER_GATE)) return;
      const spots = tierSpotsOf(chronokiCore.calls(), chronokiRawMemoryBridge.view(), gameCanvas);
      spots.forEach((spot) => drawTierMarker(renderer.ctx, spot, time));
    },
    onStop: (_gameCanvas, fxCanvas) => fxCanvas.getContext('2d')?.clearRect(0, 0, fxCanvas.width, fxCanvas.height),
  });
};

export { useChestMarkers };
