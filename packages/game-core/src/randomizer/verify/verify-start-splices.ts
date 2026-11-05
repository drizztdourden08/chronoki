/* @layer bridge-wasm @kind logic */
import { planSeedSplices } from '../apply/plan-seed-splices';
import type { ScriptSplice } from '../apply/script/script-splice.type';
import type { CtOptionValues } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';

const verifyStartSplicesOf = (options: CtOptionValues, party: CtStartParty): ScriptSplice[] =>
  planSeedSplices(options, party);

export { verifyStartSplicesOf };
