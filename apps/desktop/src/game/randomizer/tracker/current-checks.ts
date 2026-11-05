/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '@chronoki/game-core';
import { localRunHolder } from '../local-run-holder';
import { NO_CHECKS } from './tracker.constants';

const currentChecks = (): readonly CheckDef[] =>
  localRunHolder.run?.seed.checks ?? localRunHolder.applied?.checks ?? NO_CHECKS;

export { currentChecks };
