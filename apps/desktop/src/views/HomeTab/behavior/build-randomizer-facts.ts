/* @layer renderer-components @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import type { HomeFact, HomeRandomizerStatus } from '../HomeTab.type';
import { CONNECTION_LABELS } from '../HomeTab.constants';

const buildRandomizerFacts = (randomizer: Profile['randomizer'], status: HomeRandomizerStatus): HomeFact[] | null => {
  if (!randomizer) return null;
  return [
    { label: 'Seed', value: randomizer.seed, title: randomizer.seed, mono: true },
    { label: 'Connection', value: CONNECTION_LABELS[randomizer.mode === 'online' ? 'online' : 'local'] },
    { label: 'Session', value: status.sessionStatusLabel },
  ];
};

export { buildRandomizerFacts };
