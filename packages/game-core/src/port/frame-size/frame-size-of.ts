/* @layer bridge-wasm @kind logic */
import type { CkSettings } from '../core-config-ini.type';
import { CT_FRAME_HEIGHT, CT_FRAME_WIDTH } from '../chronoki-port.constants';
import { ratioToWidth } from '../aspect/ratio-to-width';
import { CT_INTERPOLATED_SCALE, CT_MAX_RENDER_SCALE, CT_WIDE_RATIOS } from './frame-size.constants';
import type { CkFrameSize } from './frame-size.type';

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

const wideWidth = ({ widescreen, wideWidth: configured }: Pick<CkSettings, 'widescreen' | 'wideWidth'>): number => {
  if (widescreen === 'off') return CT_FRAME_WIDTH;
  return configured > 0 ? configured : ratioToWidth(CT_WIDE_RATIOS[widescreen]);
};

const pictureScale = ({ renderScale, interpolation }: Pick<CkSettings, 'renderScale' | 'interpolation'>): number => {
  const k = clamp(Math.trunc(renderScale) || 1, 1, CT_MAX_RENDER_SCALE);
  return k === 1 && interpolation ? CT_INTERPOLATED_SCALE : k;
};

/* The largest picture the core draws under these settings: the canvas size. A smaller picture (a 1x frame between
   interpolated ones) is scaled up to it by the core. */
const frameSizeOf = (settings: Pick<CkSettings, 'widescreen' | 'wideWidth' | 'renderScale' | 'interpolation'>): CkFrameSize => {
  const k = pictureScale(settings);
  return { width: wideWidth(settings) * k, height: CT_FRAME_HEIGHT * k };
};

export { frameSizeOf };
