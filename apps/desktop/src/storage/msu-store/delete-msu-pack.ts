/* @layer renderer-lib @kind logic */
import { deletePack } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { ctMsuConfig } from '@chronoki/game-core';

const deleteMsuPack = (pack: string): Promise<void> => deletePack(ctMsuConfig, platformFiles(), pack);

export { deleteMsuPack };
