/* @layer bridge-wasm @kind logic */
import { DEFAULT_CK_SETTINGS } from './core-config-ini.constants';
import type { CkSettings } from './core-config-ini.type';
import type { GateOptions } from '@chronoki/features';
import { CT_ASPECT_MIN_WIDTH } from './aspect/aspect.constants';
import { resolveWideWidth } from './aspect/resolve-wide-width';

const gateSettings = (
  effective: ReadonlySet<string>,
  options: GateOptions,
  audio: Pick<CkSettings, 'volume' | 'mute'>,
): CkSettings => {
  const width = resolveWideWidth(effective, options);
  const wide = width > CT_ASPECT_MIN_WIDTH;
  return {
    ...DEFAULT_CK_SETTINGS,
    ...audio,
    widescreen: wide ? '16:9' : 'off',
    wideWidth: wide ? width : 0,
    renderScale: effective.has('renderScale') ? options.renderScale : 1,
    interpolation: effective.has('interpolate'),
    steamMargins: effective.has('wideSteamMargins'),
    fillBottomLines: effective.has('fillBottomLine'),
    sceneAdjustments: effective.has('sceneAdjust'),
    sync: effective.has('freeSync') ? 'free' : 'frame_perfect',
    instantSoundUploads: effective.has('instantUploads'),
  };
};

export { gateSettings };
