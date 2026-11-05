/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import type { CtOptionValues } from '@chronoki/game-core';
import { ctPlayerFileOf, ctWidestChecks } from '@chronoki/game-core/archipelago';

const archipelagoYamlOf = (config: RandomizerProfileConfig, appVersion: string) =>
  ctPlayerFileOf({
    world: { checks: ctWidestChecks(), options: config.options as CtOptionValues },
    ...(config.slotName === undefined ? {} : { slotName: config.slotName }),
    appVersion,
    seedText: config.seed,
    deathLink: config.deathLink === true,
  });

export { archipelagoYamlOf };
