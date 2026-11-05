/* @layer renderer-components @kind hook */
import { useTrackerReading } from '@drizztdourden08/brock-randomizer/renderer';
import type { HeroChecks } from '@app/compounds/ProfileHero';

const useHomeSaveFileChecks = (): HeroChecks | null => {
  const reading = useTrackerReading();
  if (reading === null) return null;
  const { checked, available, blocked, total } = reading.counts;
  return { taken: checked, available, left: blocked, total };
};

export { useHomeSaveFileChecks };
