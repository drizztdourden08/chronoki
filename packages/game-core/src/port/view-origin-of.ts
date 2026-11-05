/* @layer bridge-wasm @kind logic */
import { CK_EXPORT_VIEW_ORIGIN_X, CK_EXPORT_VIEW_ORIGIN_Y } from './view-origin.constants';
import type { CkViewCalls } from './view-black.type';
import type { CkViewOrigin } from './view-origin.type';

const viewOriginOf = (calls: CkViewCalls | null): CkViewOrigin | null => {
  if (!calls || !calls.has(CK_EXPORT_VIEW_ORIGIN_X) || !calls.has(CK_EXPORT_VIEW_ORIGIN_Y)) return null;
  return { x: calls.number(CK_EXPORT_VIEW_ORIGIN_X), y: calls.number(CK_EXPORT_VIEW_ORIGIN_Y) };
};

export { viewOriginOf };
