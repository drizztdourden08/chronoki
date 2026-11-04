/* @layer renderer-lib @kind logic */
import { createPack } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { chronokiMsuConfig } from './chronoki-msu-config';

const createMsuPack = (pack: string): Promise<void> => createPack(chronokiMsuConfig, platformFiles(), pack);

export { createMsuPack };
