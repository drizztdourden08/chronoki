/* @layer bridge-wasm @kind logic */
import { profileDir } from '@drizztdourden08/brock-core/storage';
import type { ActiveGame } from '../lifecycle/active-game.type';
import { screenshotBytes } from '../save-states/screenshot-bytes';
import { SCREENSHOTS_DIR } from './screenshot.constants';
import { screenshotName } from './screenshot-name';

const saveScreenshot = async (game: Pick<ActiveGame, 'files' | 'canvas' | 'profileId'>): Promise<string | null> => {
  if (!game.profileId) return null;
  const bytes = await screenshotBytes(game.canvas);
  if (!bytes) return null;
  const dir = `${profileDir(game.profileId)}/${SCREENSHOTS_DIR}`;
  await game.files.mkdir(dir);
  const path = `${dir}/${screenshotName(new Date())}`;
  await game.files.writeBytes(path, bytes);
  return path;
};

export { saveScreenshot };
