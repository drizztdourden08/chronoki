/* @layer renderer-components @kind logic */
import { STORAGE_KEY } from '../DebugFloatingControls.constants';
import type { StoredOffset } from '../DebugFloatingControls.type';

const writeStoredOffset = (offset: StoredOffset): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offset));
    return true;
  } catch {
    return false;
  }
};

export { writeStoredOffset };
