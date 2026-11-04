/* @layer renderer-lib @kind logic */
import { listPacks } from '@drizztdourden08/brock-msu/packs';
import type { MsuPackSummary } from '@drizztdourden08/brock-msu/packs';
import { platformFiles } from '../platform-files';
import { ctMsuConfig } from '@chronoki/game-core';

const listMsuPacks = (): Promise<MsuPackSummary[]> => listPacks(ctMsuConfig, platformFiles());

export { listMsuPacks };
