/* @layer bridge-wasm @kind logic */
import { idAdaptersOf } from '@drizztdourden08/brock-randomizer/archipelago';
import { ctApIds } from '@chronoki/game-core/archipelago';

const adapters = idAdaptersOf(ctApIds);

const chronokiApLocationKeyOf = (id: number, _name: string): string | null => adapters.locationKeyOf(id);

const chronokiApLocationIdOf = (key: string): number | null => adapters.locationIdOf(key);

export { chronokiApLocationIdOf, chronokiApLocationKeyOf };
