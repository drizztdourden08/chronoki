/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { getPlatform } from '@drizztdourden08/brock-react';
import { createSaveStore } from '@drizztdourden08/brock-port-kit';
import { SRAM_SLOT_COUNT, readSramSlotSummary } from '@chronoki/game-core';
import type { HeroProgressFile } from '@app/compounds/ProfileHero';
import { progressFileOf } from './progress-file-of';

const useProfileProgress = (profileId: string | null, running: boolean): HeroProgressFile[] | null => {
  const [files, setFiles] = useState<HeroProgressFile[] | null>(null);

  useEffect(() => {
    let current = true;
    if (!profileId) {
      setFiles(null);
      return undefined;
    }
    void createSaveStore(getPlatform().files).sram.read(profileId).then((bytes) => {
      if (!current) return;
      const slots = Array.from({ length: SRAM_SLOT_COUNT }, (_, slot) => (bytes ? readSramSlotSummary(bytes, slot) : null));
      setFiles(slots.flatMap((summary) => (summary ? [progressFileOf(summary)] : [])));
    });
    return () => { current = false; };
  }, [profileId, running]);

  return files;
};

export { useProfileProgress };
