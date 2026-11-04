/* @layer renderer-lib @kind logic */
import { platformFiles } from '@app/storage/platform-files';
import { capturePathOf } from './capture-path';

const deleteDebugCapture = async (profileId: string, sessionKey: string): Promise<void> => {
  await platformFiles().remove(capturePathOf(profileId, sessionKey));
};

export { deleteDebugCapture };
