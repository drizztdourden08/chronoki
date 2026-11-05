/* @layer renderer-app @kind hook */
import { useEffect, useState } from 'react';
import { useProfiles } from '@drizztdourden08/brock-react';
import { readPackSummary } from './read-pack-summary';
import type { DetectedPack } from './detected-pack.type';

const useActiveMsuPack = (): DetectedPack | null => {
  const { active } = useProfiles();
  const packName = active?.msuPack ?? null;
  const [pack, setPack] = useState<DetectedPack | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!packName) { setPack(null); return undefined; }
    readPackSummary(packName)
      .then((found) => { if (!cancelled) setPack(found); })
      .catch(() => { if (!cancelled) setPack(null); });
    return () => { cancelled = true; };
  }, [packName]);

  return pack;
};

export { useActiveMsuPack };
