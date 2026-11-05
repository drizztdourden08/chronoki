/* @layer bridge-wasm @kind logic */
import type { ScriptSplice } from '../apply/script/script-splice.type';
import { planStartState } from '../apply/start-state/plan-start-state';
import type { CtOptionValues } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { startStateOf } from './verify-start-state-of';

const verifyStartSplicesOf = (options: CtOptionValues, party: CtStartParty): ScriptSplice[] =>
  [planStartState(startStateOf(options), party)];

export { verifyStartSplicesOf };
