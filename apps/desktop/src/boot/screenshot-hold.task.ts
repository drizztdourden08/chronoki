/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { isScreenshotRequested } from '@app/launch-flags/is-screenshot-requested';
import { screenshotHold } from './screenshot-hold';

export default defineBootTask({
  label: 'Holding the screenshot for the first picture',
  run: ({ report }) => {
    if (isScreenshotRequested()) screenshotHold.take();
    report(1);
  },
});
