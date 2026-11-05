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

interface MarkerShape {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  color: string;
}

export type { MarkerPainter, MarkerShape, TierMarkerLayerProps, TierMarkerSpot };
