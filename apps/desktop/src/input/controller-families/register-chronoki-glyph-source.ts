/* @layer renderer-lib @kind logic */
import { registerGlyphSource } from '@drizztdourden08/brock-input/renderer';
import { GLYPH_SOURCE } from './glyph-source.constants';

const registerChronokiGlyphSource = (): void => {
  registerGlyphSource(GLYPH_SOURCE);
};

export { registerChronokiGlyphSource };
