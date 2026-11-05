/* @layer bridge-wasm @kind type */
import type { CtStartParty } from '../../world/party/ct-party.type';

type PreparedSeed = {
  bytes: Uint8Array;
  party: CtStartParty;
  partyIds: number[];
  flags: readonly { at: number; bits: number }[];
};

export type { PreparedSeed };
