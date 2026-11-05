/* @layer bridge-wasm @kind logic */
import { LEGACY_PARTY } from '../world/recruits/legacy-party.constants';
import type { CtStartParty } from '../world/party/ct-party.type';
import type { VerifyPartyMode } from './verify-seeds.type';
import { ALL_SUBSETS } from './verify.constants';

const verifyPartiesOf = (mode: VerifyPartyMode): readonly CtStartParty[] =>
  mode === 'legacy' ? [LEGACY_PARTY] : ALL_SUBSETS;

export { verifyPartiesOf };
