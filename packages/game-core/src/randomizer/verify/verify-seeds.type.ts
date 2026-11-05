/* @layer bridge-wasm @kind type */
import type { VerifyOptionSet } from './verify-option-set.type';

type VerifyPartyMode = 'legacy' | 'all-subsets';

type VerifySeedsRequest = {
  seeds?: readonly string[];
  count?: number;
  baseSeed?: string;
  optionSets?: readonly VerifyOptionSet[];
  party?: VerifyPartyMode;
  pack?: Uint8Array;
};

export type { VerifyPartyMode, VerifySeedsRequest };
