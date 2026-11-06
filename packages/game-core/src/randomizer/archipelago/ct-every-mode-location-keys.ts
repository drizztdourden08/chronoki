/* @layer bridge-wasm @kind logic */
import { createCtWorldDef } from '../world/create-ct-world-def';
import type { CtModeDef } from '../world/modes/ct-mode-def.type';
import { CT_MODES } from '../world/modes/ct-modes.constants';
import { ctWidestChecks } from './ct-widest-checks';
import { WIDEST_SEED } from './ct-widest-world.constants';

let keys: ReadonlySet<string> | undefined;

const modeLocationKeysOf = (mode: CtModeDef): ReadonlySet<string> => {
  const def = createCtWorldDef({ checks: ctWidestChecks(), options: { gameMode: mode.id }, fillerSeed: WIDEST_SEED });
  return new Set(def.regions.flatMap((region) => region.locations.map((location) => String(location.key))));
};

const intersectionOf = (left: ReadonlySet<string>, right: ReadonlySet<string>): ReadonlySet<string> =>
  new Set([...left].filter((key) => right.has(key)));

const ctEveryModeLocationKeys = (): ReadonlySet<string> => {
  keys ??= CT_MODES.filter((mode) => mode.implemented).map(modeLocationKeysOf).reduce(intersectionOf);
  return keys;
};

export { ctEveryModeLocationKeys };
