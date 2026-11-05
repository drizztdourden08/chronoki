/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { ChestTier } from '@chronoki/game-core';

interface TierMarkerSpot {
  tier: ChestTier;
  x: number;
  y: number;
  size: number;
}

interface TierMarkerLayerProps {
  status: string;
  gameCanvasRef: RefObject<HTMLCanvasElement | null>;
}

interface MarkerPainter {
  ctx: CanvasRenderingContext2D;
  dispose: () => void;
}

export type { MarkerPainter, TierMarkerLayerProps, TierMarkerSpot };
