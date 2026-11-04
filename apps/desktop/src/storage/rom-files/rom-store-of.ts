/* @layer renderer-lib @kind logic */
import { createRomStore } from '@drizztdourden08/brock-port-kit';
import type { RomStore } from '@drizztdourden08/brock-port-kit';
import type { FileStore } from '@drizztdourden08/brock-core';
import { CHRONOKI_PORT } from '@chronoki/game-core';

const romStoreOf = (files: FileStore): RomStore => createRomStore(files, CHRONOKI_PORT);

export { romStoreOf };
