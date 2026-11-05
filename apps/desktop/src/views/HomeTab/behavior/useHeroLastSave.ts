/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { useNormalSaves } from './useNormalSaves';

const useHeroLastSave = (normal: ReturnType<typeof useNormalSaves>) =>
  useMemo(() => {
    const latest = normal.saves[0];
    if (!latest) return null;
    return {
      name: latest.name,
      timestamp: latest.savedAt,
      screenshotUrl: normal.screenshots[latest.id] ?? null,
      busy: normal.busyId === latest.id,
      onLoad: () => void normal.load(latest.id),
    };
  }, [normal]);

export { useHeroLastSave };
