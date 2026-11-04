/* @layer bridge-wasm @kind logic */
import type { CkSettings } from '../core-config-ini.type';
import { CT_FRAME_HEIGHT, CT_FRAME_WIDTH } from '../chronoki-port.constants';
import { CT_TALL_MAX_LINES } from '../aspect/aspect.constants';
import { ratioToWidth } from '../aspect/ratio-to-width';
import { CT_INTERPOLATED_SCALE, CT_MAX_RENDER_SCALE, CT_WIDE_RATIOS } from './frame-size.constants';
import type { CkFrameInput, CkFrameSize } from './frame-size.type';

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

const wideWidth = ({ widescreen, wideWidth: configured }: Pick<CkSettings, 'widescreen' | 'wideWidth'>): number => {
  if (widescreen === 'off') return CT_FRAME_WIDTH;
  return configured > 0 ? configured : ratioToWidth(CT_WIDE_RATIOS[widescreen]);
};

const tallLines = ({ widescreen, tallLines: lines }: CkFrameInput): number => {
  if (widescreen !== 'off' || !lines || lines <= CT_FRAME_HEIGHT) return 0;
  return Math.min(CT_TALL_MAX_LINES, lines & ~1);
};

const pictureScale = ({ renderScale, interpolation }: Pick<CkSettings, 'renderScale' | 'interpolation'>): number => {
  const k = clamp(Math.trunc(renderScale) || 1, 1, CT_MAX_RENDER_SCALE);
  return k === 1 && interpolation ? CT_INTERPOLATED_SCALE : k;
};

const frameSizeOf = (settings: CkFrameInput): CkFrameSize => {
  const lines = tallLines(settings);
  if (lines > 0) return { width: CT_FRAME_WIDTH, height: lines };
  const k = pictureScale(settings);
  return { width: wideWidth(settings) * k, height: CT_FRAME_HEIGHT * k };
};

export { frameSizeOf };
