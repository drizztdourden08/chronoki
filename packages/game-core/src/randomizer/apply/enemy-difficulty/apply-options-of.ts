/* @layer bridge-wasm @kind logic */
import type { ApplyOptions } from '../apply-seed.type';
import { APPLY_OPTION_MAPPERS } from './apply-option-mappers.constants';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

const applyOptionsOf = (options: OptionBag, spheres: readonly SphereLike[], seed?: string): ApplyOptions =>
  APPLY_OPTION_MAPPERS.reduce<ApplyOptions>((applied, mapper) => ({ ...applied, ...mapper({ options, spheres, seed }) }), {});

export { applyOptionsOf };
