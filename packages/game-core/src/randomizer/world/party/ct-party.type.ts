/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from '../ct-world-input.type';
import type { CtCharacter } from '../ct-world-keys.type';

type CtPartyMode = 'random' | 'custom';

type CtStartParty = readonly CtCharacter[];

type CtPartySource = { resolve: (options: CtOptionValues, seed: string) => CtStartParty };

export type { CtPartyMode, CtPartySource, CtStartParty };
