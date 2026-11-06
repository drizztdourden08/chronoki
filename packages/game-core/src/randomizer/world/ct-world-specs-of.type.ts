/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from './ct-world-input.type';
import type { CtModeDef } from './modes/ct-mode-def.type';
import type { CtStartParty } from './party/ct-party.type';

type SpecsContext = { mode: CtModeDef; options: CtOptionValues; party: CtStartParty; duplicate: boolean };

export type { SpecsContext };
