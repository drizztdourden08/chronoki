/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { createSaveStore } from '@drizztdourden08/brock-port-kit';
import type { HeroChecks, HeroProgressFile } from '@app/compounds/ProfileHero';
import { seedChecksOfProfile } from './seed-checks-of-profile';
import { slotHeroChecksOf } from './slot-hero-checks-of';

const useHomeSaveFileChecks = (files: HeroProgressFile[], profileId: string | null, romFile: string | null): HeroProgressFile[] => {
  const [bySlot, setBySlot] = useState<ReadonlyMap<number, HeroChecks>>(new Map());

  useEffect(() => {
    let current = true;
    if (profileId === null || romFile === null) {
      setBySlot(new Map());
      return undefined;
    }
    void Promise.all([createSaveStore(getPlatform().files).sram.read(profileId), seedChecksOfProfile(profileId, romFile)])
      .then(([bytes, checks]) => {
        if (!current) return;
        const next = new Map<number, HeroChecks>();
        if (bytes) {
          for (const file of files) {
            const slotChecks = slotHeroChecksOf(bytes, file.slot, checks);
            if (slotChecks) next.set(file.slot, slotChecks);
          }
        }
        setBySlot(next);
      })
      .catch(() => { if (current) setBySlot(new Map()); });
    return () => { current = false; };
  }, [files, profileId, romFile]);

  return files.map((file) => ({ ...file, checks: bySlot.get(file.slot) }));
};

export { useHomeSaveFileChecks };
