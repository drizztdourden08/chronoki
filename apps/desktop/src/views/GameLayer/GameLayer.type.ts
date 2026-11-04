/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { WindowMode } from '@drizztdourden08/brock-core';
import type { CkFrameSize } from '@chronoki/game-core';
import type { AspectRatioChoice } from '@chronoki/features';
import type { ViewportMode } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';

interface GameBootArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  launch: GameLaunch | null;
}

interface StageClassArgs {
  visible: boolean;
  gates: ReadonlySet<string>;
  viewport: ViewportMode;
  pixelPerfect: boolean;
  boxed: boolean;
}

interface AspectLockArgs {
  viewport: ViewportMode;
  windowMode: WindowMode;
  isFullscreen: boolean;
  frame: CkFrameSize;
}

interface PresentBox {
  width: number;
  height: number;
  boxed: boolean;
}

interface PresentRatioArgs {
  gates: ReadonlySet<string>;
  aspectRatio: AspectRatioChoice;
  customAspectW: number;
  customAspectH: number;
}

export type { AspectLockArgs, PresentBox, PresentRatioArgs, GameBootArgs, StageClassArgs };
