/* @layer renderer-components @kind logic */
import { STORAGE_KEY } from '../DebugFloatingControls.constants';
import type { StoredOffset } from '../DebugFloatingControls.type';

const writeStoredOffset = (offset: StoredOffset): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offset));
  } catch {
    return;
  }
};

export { writeStoredOffset };
