/* @layer renderer-lib @kind logic */
import { platformFiles } from '../platform-files';
import { romStoreOf } from '../rom-files';
import type { TitlePendulumArt } from './title-pendulum.type';
import { buildTitlePendulum } from './build-title-pendulum';
import { pendulumFile } from './pendulum-file';
import { pngSize } from './png-size';

const savedOrBuilt = async (romFile: string): Promise<Uint8Array | null> => {
  const files = platformFiles();
  const saved = await files.readBytes(pendulumFile(romFile));
  if (saved && saved.length > 0) return saved;
  const target = romStoreOf(files).assetFileOf(romFile);
  const assets = target ? await files.readBytes(target) : null;
  return assets && assets.length > 0 ? buildTitlePendulum(files, romFile, assets) : null;
};

const loadTitlePendulum = async (romFile: string): Promise<TitlePendulumArt | null> => {
  try {
    const png = await savedOrBuilt(romFile);
    const size = png ? pngSize(png) : null;
    return png && size ? { png, ...size } : null;
  } catch {
    return null;
  }
};

export { loadTitlePendulum };
