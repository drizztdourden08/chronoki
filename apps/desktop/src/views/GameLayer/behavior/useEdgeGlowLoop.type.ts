/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { EdgeGlowRenderer } from '@chronoki/game-core';

interface EdgeGlowLoopParams {
  status: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fxCanvasRef: RefObject<HTMLCanvasElement | null>;
  gates: ReadonlySet<string>;
}

interface FadeState {
  prevBlackLeft: number;
  prevBlackRight: number;
  prevBlackBottom: number;
  prevBlackTop: number;
  fadeOpacity: number;
  fadeTarget: number;
  lastTime: number;
}

type GlowControls = Pick<EdgeGlowRenderer, 'setEnabled' | 'setBlackBounds' | 'setMaxBounds'>;

export type { EdgeGlowLoopParams, FadeState, GlowControls };
