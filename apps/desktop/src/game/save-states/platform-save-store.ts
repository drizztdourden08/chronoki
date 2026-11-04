/* @layer bridge-wasm @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import { ctSaveCompanions } from '@chronoki/game-core';
import { createSaveStore } from '@drizztdourden08/brock-port-kit';
import type { SaveStore } from '@drizztdourden08/brock-port-kit';

const platformSaveStore = (): SaveStore => createSaveStore(getPlatform().files, { companions: ctSaveCompanions });

export { platformSaveStore };
