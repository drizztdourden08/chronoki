/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import { CT_PARTY_SOURCES } from './ct-party-sources.constants';
import type { CtPartyMode, CtStartParty } from './ct-party.type';

const isPartyMode = (mode: unknown): mode is CtPartyMode => mode === 'random' || mode === 'custom';

const resolveStartParty = (options: CtOptionValues, seed: string): CtStartParty => {
  const mode = options.partyMode ?? 'random';
  if (!isPartyMode(mode)) throw new Error(`unknown partyMode: ${String(mode)}`);
  return CT_PARTY_SOURCES[mode].resolve(options, seed);
};

export { resolveStartParty };
