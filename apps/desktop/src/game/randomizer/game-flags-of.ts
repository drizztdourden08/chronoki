/* @layer bridge-wasm @kind logic */
import type { CkGameFlags } from '@chronoki/game-core';

const gameFlagsOf = (randomizer: boolean, disableGlitches: boolean): CkGameFlags => ({
  randomizer,
  disableGlitches: randomizer && disableGlitches,
});

export { gameFlagsOf };
