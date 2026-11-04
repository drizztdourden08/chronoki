/* @layer renderer-lib @kind constants */
import type { GlyphSource } from '@drizztdourden08/brock-input/renderer';
import { getButtonIconUrl } from '@app/input/button-icons/get-button-icon-url';
import { CONTROLLER_ICON_MAP } from './controller-icon-map.constants';

const GLYPH_SOURCE: GlyphSource = {
  button: (glyph) => getButtonIconUrl(glyph),
  controller: (family) => CONTROLLER_ICON_MAP[family],
};

export { GLYPH_SOURCE };
