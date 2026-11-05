/* @layer bridge-wasm @kind logic */
import type { CtStartParty } from './ct-party.type';
import { ACTIVE_SLOTS } from './start-party-label-of.constants';

const nameOf = (id: string): string => `${id.charAt(0).toUpperCase()}${id.slice(1)}`;

const startPartyLabelOf = (party: CtStartParty): string => {
  const active = party.slice(0, ACTIVE_SLOTS).map(nameOf).join(', ');
  const reserve = party.slice(ACTIVE_SLOTS).map(nameOf).join(', ');
  return reserve === '' ? active : `${active} (reserve: ${reserve})`;
};

export { startPartyLabelOf };
