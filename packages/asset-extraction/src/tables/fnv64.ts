/* @layer shared-asset-extraction @kind logic */
import { FNV_OFFSET, FNV_PRIME } from './fnv64.constants';

const encoder = new TextEncoder();

const fnv64 = (text: string): bigint => {
  let h = FNV_OFFSET;
  for (const c of encoder.encode(text)) h = BigInt.asUintN(64, (h ^ BigInt(c)) * FNV_PRIME);
  return h;
};

export { fnv64 };
