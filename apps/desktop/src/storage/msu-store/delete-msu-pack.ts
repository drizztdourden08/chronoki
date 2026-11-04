/* @layer renderer-lib @kind logic */
import { deletePack } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { chronokiMsuConfig } from './chronoki-msu-config';

const deleteMsuPack = (pack: string): Promise<void> => deletePack(chronokiMsuConfig, platformFiles(), pack);

export { deleteMsuPack };
