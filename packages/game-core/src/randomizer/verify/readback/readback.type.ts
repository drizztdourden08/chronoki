/* @layer bridge-wasm @kind type */
import type { CtStartState } from '../../apply/start-state/ct-start-state.type';
import type { CheckDef } from '../../checks/check.type';
import type { CtStartParty } from '../../world/party/ct-party.type';

type MismatchKind = 'chest' | 'gift' | 'roster' | 'joined' | 'flag' | 'start-poke' | 'warp' | 'start-block';

type Mismatch = {
  kind: MismatchKind;
  location: string;
  expected: number | null;
  actual: number | null;
  address: number;
};

type ReadbackOptions = {
  checks?: readonly CheckDef[];
  startState?: CtStartState;
  party?: CtStartParty;
};

type DecodedOp = { kind: 'poke' | 'set-bit' | 'reset-bit' | 'warp' | 'other'; address: number; value: number };

export type { DecodedOp, Mismatch, MismatchKind, ReadbackOptions };
