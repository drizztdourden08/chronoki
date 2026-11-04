/* @layer bridge-wasm @kind logic */
import type { AppliedSeed, LocalRun } from './local-run.type';

const localRunHolder: { applied: AppliedSeed | null; run: LocalRun | null } = { applied: null, run: null };

export { localRunHolder };
