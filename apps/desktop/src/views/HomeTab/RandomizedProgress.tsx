/* @layer renderer-components @kind component */
import { HeroProgress } from '@app/compounds/ProfileHero';
import type { RandomizedProgressProps } from './HomeTab.type';
import { useHomeSaveFileChecks } from './behavior/useHomeSaveFileChecks';

const RandomizedProgress = ({ files, profileId, romFile }: RandomizedProgressProps) => {
  const withChecks = useHomeSaveFileChecks(files, profileId, romFile);
  return <HeroProgress files={withChecks} />;
};

export { RandomizedProgress };
