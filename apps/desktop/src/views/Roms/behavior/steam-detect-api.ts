/* @layer renderer-components @kind logic */
import { requireAppApi } from '@app/ipc/require-app-api';

const steamDetectApi = (): ReturnType<typeof requireAppApi> | null => {
  try {
    return requireAppApi();
  } catch {
    return null;
  }
};

export { steamDetectApi };
