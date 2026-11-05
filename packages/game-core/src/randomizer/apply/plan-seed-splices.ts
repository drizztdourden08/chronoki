/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../world/ct-world-input.type';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import { modeOf } from '../world/modes/mode-of';
import type { CtStartParty } from '../world/party/ct-party.type';
import { MODE_SPLICERS } from './modes/mode-splicers.constants';
import type { ScriptSplice } from './script/script-splice.type';
import { planStartState } from './start-state/plan-start-state';
import { startStateOf } from './start-state/start-state-of';

const planSeedSplices = (options: CtOptionValues, party: CtStartParty): ScriptSplice[] => {
  const effective = effectiveOptionsOf(options);
  const modeSplicer = MODE_SPLICERS[modeOf(effective).id];
  return [
    planStartState(startStateOf(effective), party),
    ...(modeSplicer === undefined ? [] : modeSplicer(effective, party)),
  ];
};

export { planSeedSplices };
