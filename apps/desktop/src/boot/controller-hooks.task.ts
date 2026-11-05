/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { registerControllerHooks, reportDeviceCardAction } from '@drizztdourden08/brock-input/renderer';
import { GLYPH_SOURCE } from '@app/input/controller-families/glyph-source.constants';

export default defineBootTask({
  label: 'Registering the controller pages',
  run: ({ report }) => {
    registerControllerHooks({ actions: [reportDeviceCardAction()], glyphSource: GLYPH_SOURCE });
    report(1);
  },
});
