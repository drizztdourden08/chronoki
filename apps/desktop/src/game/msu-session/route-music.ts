/* @layer bridge-wasm @kind logic */
import { FADE_CTRL_BASE } from '@chronoki/game-core';
import { resolveMsuTrack } from '@chronoki/game-data';
import { STOP_CUE } from './msu-session.constants';
import type { MsuRoute } from './msu-session.type';

const KEEP: MsuRoute = { cue: null, packPlaying: null };

const routeTrack = (trackNum: number, fallback: number | undefined, has: (track: number) => boolean, chip: boolean): MsuRoute => {
  if (has(trackNum)) return { cue: trackNum, packPlaying: true };
  if (fallback !== undefined && has(fallback)) return { cue: fallback, packPlaying: true };
  return { cue: STOP_CUE, packPlaying: !chip };
};

const routeMusic = (ctrl: number, has: (track: number) => boolean, chipFallback: boolean): MsuRoute => {
  if (ctrl >= FADE_CTRL_BASE) return { cue: ctrl, packPlaying: null };
  const resolved = resolveMsuTrack(ctrl);
  if (resolved.kind === 'ignored') return KEEP;
  if (resolved.kind === 'silence') return { cue: STOP_CUE, packPlaying: false };
  return routeTrack(resolved.trackNum, resolved.fallback, has, chipFallback);
};

export { routeMusic };
