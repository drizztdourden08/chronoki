/* @layer bridge-wasm @kind type */
import type { CtEra } from '@chronoki/game-core';

type LocationIndex = { eraOf: ReadonlyMap<string, CtEra>; nameOf: ReadonlyMap<string, string> };

export type { LocationIndex };
