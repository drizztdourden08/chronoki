/* @layer bridge-wasm @kind constants */
import type { CheckKind } from '../checks/check.type';

const CT_WIDEST_CHECK_KINDS: readonly (readonly [string, CheckKind])[] = [
  ['chest', 'chest'],
  ['gift', 'gift'],
];

export { CT_WIDEST_CHECK_KINDS };
