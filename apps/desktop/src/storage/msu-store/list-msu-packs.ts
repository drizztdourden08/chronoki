/* @layer renderer-lib @kind logic */
import { listPacks } from '@drizztdourden08/brock-msu/packs';
import type { MsuPackSummary } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { chronokiMsuConfig } from './chronoki-msu-config';

const listMsuPacks = (): Promise<MsuPackSummary[]> => listPacks(chronokiMsuConfig, platformFiles());

export { listMsuPacks };
