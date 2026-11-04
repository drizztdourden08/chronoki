/* @layer renderer-lib @kind logic */
import { createPack } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { ctMsuConfig } from '@chronoki/game-core';

const createMsuPack = (pack: string): Promise<void> => createPack(ctMsuConfig, platformFiles(), pack);

export { createMsuPack };
