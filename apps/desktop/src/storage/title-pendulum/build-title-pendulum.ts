/* @layer renderer-lib @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import { ASSETS_DIR } from '@app/profiles/storage';
import { PENDULUM_TABLE_NAMES } from './title-pendulum.constants';
import { readPackTables } from './read-pack-tables';
import { pendulumTexture } from './pendulum-texture';
import { pendulumRgba } from './pendulum-rgba';
import { encodePng } from './encode-png';
import { pendulumFile } from './pendulum-file';

const buildTitlePendulum = async (files: FileStore, romFile: string, assets: Uint8Array): Promise<Uint8Array | null> => {
  const pack = readPackTables(assets, PENDULUM_TABLE_NAMES);
  const texture = pack ? pendulumTexture(pack) : null;
  const image = texture ? pendulumRgba(texture) : null;
  const png = image ? await encodePng(image) : null;
  if (!png) return null;
  await files.mkdir(ASSETS_DIR);
  await files.writeBytes(pendulumFile(romFile), png);
  return png;
};

export { buildTitlePendulum };
