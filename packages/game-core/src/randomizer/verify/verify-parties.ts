/* @layer bridge-wasm @kind logic */
import { LEGACY_PARTY } from '../world/recruits/legacy-party.constants';
import { CT_CHARACTERS } from '../world/party/ct-party.constants';
import type { CtStartParty } from '../world/party/ct-party.type';
import type { VerifyPartyMode } from './verify-seeds.type';

const SUBSET_COUNT = (1 << CT_CHARACTERS.length) - 1;

const ALL_SUBSETS: readonly CtStartParty[] = Array.from({ length: SUBSET_COUNT }, (_, index) =>
  CT_CHARACTERS.filter((_id, bit) => (index + 1) & (1 << bit)));

const verifyPartiesOf = (mode: VerifyPartyMode): readonly CtStartParty[] =>
  mode === 'legacy' ? [LEGACY_PARTY] : ALL_SUBSETS;

export { verifyPartiesOf };
