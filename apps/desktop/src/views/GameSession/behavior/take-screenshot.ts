/* @layer renderer-appshell @kind logic */
import { activeGameHolder } from '@app/game/lifecycle';
import { saveScreenshot } from '@app/game/screenshot';
import { appLog } from '@app/log/app-log';

const takeScreenshot = async (): Promise<void> => {
  const game = activeGameHolder.current;
  if (!game) return;
  try {
    const path = await saveScreenshot(game);
    appLog.info(path ? `[screenshot] saved ${path}` : '[screenshot] nothing to save');
  } catch (cause) {
    appLog.warn('[screenshot] failed', cause);
  }
};

export { takeScreenshot };
