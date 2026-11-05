/* @layer bridge-wasm @kind logic */
import type { PollEntry } from '@drizztdourden08/brock-randomizer/session';
import { ctPollEntries } from '@chronoki/game-core';
import { localRunHolder } from '../local-run-holder';

const NO_ENTRIES: readonly PollEntry[] = [];

const currentPollEntries = (): readonly PollEntry[] => {
  const seed = localRunHolder.run?.seed ?? localRunHolder.applied;
  return seed === null ? NO_ENTRIES : ctPollEntries(seed.checks, seed.plan.pack);
};

export { currentPollEntries };
