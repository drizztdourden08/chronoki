/* @layer bridge-wasm @kind types */
import type { MsuBridge } from '@chronoki/game-core';
import type { AppSettings } from '@app/settings.type';

interface MsuLive {
  settings: AppSettings;
  gates: ReadonlySet<string>;
}

interface MsuRoute {
  cue: number | null;
  packPlaying: boolean | null;
}

interface MsuRuntime {
  generation: number;
  bridge: MsuBridge | null;
  stopPoll: (() => void) | null;
}

export type { MsuLive, MsuRoute, MsuRuntime };
