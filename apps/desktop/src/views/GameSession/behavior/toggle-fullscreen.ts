/* @layer renderer-appshell @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';

const toggleFullscreen = async (): Promise<void> => {
  const win = getPlatform().window;
  win.setFullscreen(!(await win.isFullscreen()));
};

export { toggleFullscreen };
