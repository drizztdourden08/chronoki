/* @layer bridge-wasm @kind logic */
import { idAdaptersOf } from '@drizztdourden08/brock-randomizer/archipelago';
import { ctApIds } from '@chronoki/game-core/archipelago';

const chronokiApIdAdapters = idAdaptersOf(ctApIds);

export { chronokiApIdAdapters };
