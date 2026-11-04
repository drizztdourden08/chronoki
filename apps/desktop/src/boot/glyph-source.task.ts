/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { registerChronokiGlyphSource } from '@app/input/controller-families/register-chronoki-glyph-source';

export default defineBootTask({
  label: 'Registering the controller glyphs',
  run: ({ report }) => {
    registerChronokiGlyphSource();
    report(1);
  },
});
