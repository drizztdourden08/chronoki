/* @layer renderer-appshell @kind types */
import type { ReactNode } from 'react';
import type { CkArea, CkSettings } from '@chronoki/game-core';
import type { FunctionAction } from '@chronoki/input-mapping';
import type { CoreStatus } from '@drizztdourden08/brock-port-kit/renderer';

interface GameLaunch {
  id: number;
  profileId: string;
  romFile: string;
}

interface GameSessionValue {
  launch: GameLaunch | null;
  notice: string | null;
  running: boolean;
  paused: boolean;
  config: string;
  settings: CkSettings;
  volume: number;
  gates: ReadonlySet<string>;
  pictureRatio: number;
  setStageArea: (area: CkArea) => void;
  play: () => void;
  stop: () => void;
  reset: () => void;
  togglePause: () => void;
  onStarted: () => void;
  onFunctionAction: (action: FunctionAction) => void;
  onFunctionRelease: (action: FunctionAction) => void;
}

interface PauseSyncInputs {
  running: boolean;
  inputPaused: boolean;
  status: CoreStatus;
}

interface PauseSyncPlan {
  releaseInput: boolean;
  corePaused: boolean | null;
}

interface GameSessionProps {
  children: ReactNode;
}

export type { GameLaunch, GameSessionProps, GameSessionValue, PauseSyncInputs, PauseSyncPlan };
