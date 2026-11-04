/* @layer shared-asset-extraction @kind logic @source Python lz.lz_decompress inner steps */
import type { LzState } from './lz-decompress.type';
import { copyBytes } from './lz-copy-bytes';
import { ensure } from './lz-ensure';
import { literal } from './lz-literal';

const step = (st: LzState, isCopy: number): void => {
  ensure(st, st.workPos + 4096);
  if (isCopy) copyBytes(st);
  else literal(st);
};

export { step };
