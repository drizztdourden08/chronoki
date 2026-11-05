/* @layer renderer-app @kind component */
import { useStopGameBeforeRemove } from '@app/profiles/useStopGameBeforeRemove';

const ProfileRemovalGuard = () => {
  useStopGameBeforeRemove();
  return null;
};

export { ProfileRemovalGuard };
