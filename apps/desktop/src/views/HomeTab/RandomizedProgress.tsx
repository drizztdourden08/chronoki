/* @layer renderer-components @kind component */
import { HeroProgress } from '@app/compounds/ProfileHero';
import type { RandomizedProgressProps } from './HomeTab.type';
import { useHomeSaveFileChecks } from './behavior/useHomeSaveFileChecks';

const RandomizedProgress = ({ files }: RandomizedProgressProps) => {
  const checks = useHomeSaveFileChecks();
  return <HeroProgress files={files} checks={checks} />;
};

export { RandomizedProgress };
