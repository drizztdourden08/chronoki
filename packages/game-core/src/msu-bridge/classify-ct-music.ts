/* @layer bridge-wasm @kind logic */
import type { MusicCommand } from '@drizztdourden08/brock-msu';
import { resolveMsuTrack } from '@chronoki/game-data';
import { FADE_CTRL_BASE, FADE_STEP } from './msu-bridge.constants';

const classifyCtMusic = (ctrl: number): MusicCommand => {
  if (ctrl >= FADE_CTRL_BASE) return { kind: 'fade', target: ctrl - FADE_CTRL_BASE, step: FADE_STEP };
  const resolved = resolveMsuTrack(ctrl);
  return resolved.kind === 'ignored' ? { kind: 'ignore' } : { kind: 'track', track: resolved.trackNum };
};

export { classifyCtMusic };
