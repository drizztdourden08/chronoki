/* @layer bridge-wasm @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CtPlacement } from '@chronoki/game-core';
import { placementFile } from '@app/profiles/storage';
import { dumpPlacement } from './dump-placement';

const savePlacement = async (files: FileStore, profileId: string, placement: CtPlacement): Promise<void> => {
  await files.writeText(placementFile(profileId), dumpPlacement(placement));
};

export { savePlacement };
