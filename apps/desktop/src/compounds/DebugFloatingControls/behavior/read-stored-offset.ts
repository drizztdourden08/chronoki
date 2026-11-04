/* @layer renderer-components @kind logic */
import { DEFAULT_OFFSET, STORAGE_KEY } from '../DebugFloatingControls.constants';
import type { StoredOffset } from '../DebugFloatingControls.type';

const isStoredOffset = (value: unknown): value is StoredOffset =>
  typeof value === 'object' && value !== null
  && 'top' in value && typeof value.top === 'number'
  && 'right' in value && typeof value.right === 'number';

const readStoredOffset = (): StoredOffset => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_OFFSET;
    const parsed: unknown = JSON.parse(raw);
    return isStoredOffset(parsed) ? parsed : DEFAULT_OFFSET;
  } catch {
    return DEFAULT_OFFSET;
  }
};

export { readStoredOffset };
