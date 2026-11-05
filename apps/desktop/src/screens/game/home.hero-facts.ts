/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { HeroProps } from '@drizztdourden08/brock-react';
import { buildProfileFacts, buildRandomizerFacts, romFileOf, useHomeRandomizerStatus } from '@app/views/HomeTab';

const useHeroFacts = (profile: HeroProps['profile']) => {
  const romFile = romFileOf(profile);
  const randomizerStatus = useHomeRandomizerStatus();
  const randomizer = profile?.randomizer;
  const lastPlayed = profile?.lastPlayed;
  const created = profile?.created;
  return useMemo(() => {
    const own = buildProfileFacts({ romFile, lastPlayed, created });
    const run = buildRandomizerFacts(randomizer, randomizerStatus);
    return run ? [run, ...own] : own;
  }, [romFile, lastPlayed, created, randomizer, randomizerStatus]);
};

export { useHeroFacts };
