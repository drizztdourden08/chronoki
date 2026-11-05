/* @layer bridge-wasm @kind type */
import type { ApplyOptions } from '../apply-seed.type';
import type { OptionBag, SphereLike } from './enemy-difficulty.type';

type ApplyOptionInput = { options: OptionBag; spheres: readonly SphereLike[]; seed: string | undefined };

type ApplyOptionMapper = (input: ApplyOptionInput) => ApplyOptions;

export type { ApplyOptionInput, ApplyOptionMapper };
