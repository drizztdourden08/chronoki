/* @layer bridge-wasm @kind type */
import type { CtOptionValues } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import type { ScriptSplice } from './script/script-splice.type';

type ModeSplicer = (options: CtOptionValues, party: CtStartParty) => ScriptSplice[];

export type { ModeSplicer };
