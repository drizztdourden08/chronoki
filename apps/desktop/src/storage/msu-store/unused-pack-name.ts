/* @layer renderer-lib @kind logic */
import { DEFAULT_PACK_NAME } from './msu-store.constants';

const unusedPackName = (wanted: string, existing: string[]): string => {
  const base = wanted.replace(/[<>:"/\\|?*\p{Cc}]/gu, '').replace(/\s+/g, ' ').trim() || DEFAULT_PACK_NAME;
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base} (${n})`)) n += 1;
  return `${base} (${n})`;
};

export { unusedPackName };
