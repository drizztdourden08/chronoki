/* @layer bridge-wasm @kind type */
import type { CtStartParty } from '../world/party/ct-party.type';

type VerifyStuck = {
  sphere: number;
  unreachable: string[];
  missingItems: string[];
  missingEvents: string[];
};

type VerifyResult = {
  ok: boolean;
  seed: string;
  options: string;
  startParty: CtStartParty;
  spheres: string[][];
  stuckAt?: VerifyStuck;
  error?: string;
};

type VerifyFailure = {
  seed: string;
  optionSet: string;
  party: string;
  sphere?: number;
  unreachable?: number;
  error?: string;
};

type VerifySummary = {
  runs: number;
  passes: number;
  failures: VerifyFailure[];
};

export type { VerifyFailure, VerifyResult, VerifyStuck, VerifySummary };
