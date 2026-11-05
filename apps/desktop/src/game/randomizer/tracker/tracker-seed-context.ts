/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '@chronoki/game-core';

type TrackerSeedContext = { options?: CtOptionValues; sealedCheckIds?: ReadonlySet<string> };

const trackerSeedContext: TrackerSeedContext = {};

export type { TrackerSeedContext };
export { trackerSeedContext };
