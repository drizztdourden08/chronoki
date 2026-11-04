/* @layer bridge-wasm @kind logic */
import { DEFAULT_CK_SETTINGS } from './core-config-ini.constants';
import type { CkSettings } from './core-config-ini.type';
import type { GateOptions } from '@chronoki/features';

const gateSettings = (
  effective: ReadonlySet<string>,
  options: GateOptions,
  audio: Pick<CkSettings, 'volume' | 'mute'>,
): CkSettings => ({
  ...DEFAULT_CK_SETTINGS,
  ...audio,
  widescreen: effective.has('widescreen') ? options.widescreenAspect : 'off',
  renderScale: effective.has('renderScale') ? options.renderScale : 1,
  interpolation: effective.has('interpolate'),
  steamMargins: effective.has('wideSteamMargins'),
  fillBottomLines: effective.has('fillBottomLine'),
  sceneAdjustments: effective.has('sceneAdjust'),
  sync: effective.has('freeSync') ? 'free' : 'frame_perfect',
  instantSoundUploads: effective.has('instantUploads'),
});

export { gateSettings };
