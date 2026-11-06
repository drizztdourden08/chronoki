/* @layer renderer-components @kind component */
import { ArchipelagoFilesSlot } from '@drizztdourden08/brock-randomizer/renderer';
import { ctArchipelagoFilesSourceOf } from './ct-archipelago-files-source';
import { useAppVersion } from './useAppVersion';

const CtArchipelagoFilesSlot = () => {
  const appVersion = useAppVersion();
  if (appVersion === null) return null;
  return <ArchipelagoFilesSlot sourceOf={ctArchipelagoFilesSourceOf(appVersion)} />;
};

export { CtArchipelagoFilesSlot };
