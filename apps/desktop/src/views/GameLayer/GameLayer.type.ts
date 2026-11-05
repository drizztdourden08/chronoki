/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { WindowMode } from '@drizztdourden08/brock-core';
import type { CkArea, CkPresentMode, CkSettings } from '@chronoki/game-core';
import type { ViewportMode } from '@app/settings.type';
import type { GameLaunch } from '@app/views/GameSession';

interface GameBootArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  launch: GameLaunch | null;
}

interface SessionPicture {
  frame: CkArea;
  ratio: number;
}

interface StageClassArgs {
  visible: boolean;
  gates: ReadonlySet<string>;
  mode: CkPresentMode;
}

interface SettleState {
  elapsed: number;
  fullscreenPending: boolean;
}

interface StageWait {
  id: number;
  since: number;
  /** null until the launch profile's settings are loaded and the start-fullscreen choice is known. */
  fullscreen: boolean | null;
}

interface BootedPlan {
  config: string;
  settings: CkSettings;
  ratio: number;
}

type ReplanVerdict = 'idle' | 'replan' | 'defer';

interface ReplanInputs {
  live: boolean;
  busy: boolean;
  runningFrame: string;
  plannedFrame: string;
  blockedFrame: string | null;
  savable: boolean;
  mode: string | null;
}

interface FrameReplanArgs {
  booted: BootedPlan | null;
  planned: BootedPlan;
  volume: number;
  onReplanned: (plan: BootedPlan) => void;
}

interface DeferredReplan {
  frame: string;
  tick: number;
}

interface AspectLockArgs {
  viewport: ViewportMode;
  windowMode: WindowMode;
  isFullscreen: boolean;
  ratio: number;
}

export type {
  AspectLockArgs, BootedPlan, DeferredReplan, FrameReplanArgs, GameBootArgs, ReplanInputs, ReplanVerdict, SessionPicture, SettleState,
  StageClassArgs, StageWait,
};
