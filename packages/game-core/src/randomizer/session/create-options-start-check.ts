/* @layer bridge-wasm @kind logic */
import { fitStartParty } from '../apply/start-state/fit-start-party';
import { LEGACY_PARTY } from '../apply/start-state/legacy-party.constants';
import { startStateOf } from '../apply/start-state/start-state-of';
import { START_STATES } from '../apply/start-state/start-states.constants';
import type { CtOptionValues } from '../world/ct-world-input.type';
import { effectiveOptionsOf } from '../world/modes/effective-options-of';
import { modeOf } from '../world/modes/mode-of';
import type { CtStartParty } from '../world/party/ct-party.type';
import { createStartStateCheck } from './create-start-state-check';
import type { StartStateCheck } from './create-start-state-check.type';

const createOptionsStartCheck = (options: CtOptionValues, party: CtStartParty = LEGACY_PARTY): StartStateCheck | null => {
  const effective = effectiveOptionsOf(options);
  if (START_STATES[modeOf(effective).startState] === undefined) return null;
  return createStartStateCheck(startStateOf(effective), fitStartParty(party, effective));
};

export { createOptionsStartCheck };
