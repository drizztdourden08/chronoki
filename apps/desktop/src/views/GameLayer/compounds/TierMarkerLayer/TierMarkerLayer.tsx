/* @layer renderer-components @kind component */
import { useRef } from 'react';
import { Canvas } from '@drizztdourden08/tessera/primitives';
import { useChestMarkers } from './behavior/useChestMarkers';
import type { TierMarkerLayerProps } from './TierMarkerLayer.type';

const TierMarkerLayer = ({ status, gameCanvasRef }: TierMarkerLayerProps) => {
  const markerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useChestMarkers({ status, gameCanvasRef, markerCanvasRef });
  return <Canvas ref={markerCanvasRef} className="game-layer__markers" aria-hidden="true" />;
};

export { TierMarkerLayer };
