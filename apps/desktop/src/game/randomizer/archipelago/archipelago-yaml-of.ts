/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { ctPlayerFileOf, ctWidestChecks } from '@chronoki/game-core/archipelago';

const archipelagoYamlOf = (config: RandomizerProfileConfig, appVersion: string) =>
  ctPlayerFileOf({
    world: { checks: ctWidestChecks(), options: config.options },
    ...(config.slotName === undefined ? {} : { slotName: config.slotName }),
    appVersion,
    seedText: config.seed,
    deathLink: config.deathLink === true,
  });

export { archipelagoYamlOf };
