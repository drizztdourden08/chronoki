/* @layer renderer-appshell @kind logic */
import { isProbeInput } from '@app/launch-flags/is-probe-input';
import { isProbeSram } from '@app/launch-flags/is-probe-sram';
import { isScreenshotRequested } from '@app/launch-flags/is-screenshot-requested';

const needsScreenshotWait = (frames: number | null): boolean => {
  if (frames !== null || isProbeInput() || isProbeSram()) return false;
  return isScreenshotRequested();
};

export { needsScreenshotWait };
