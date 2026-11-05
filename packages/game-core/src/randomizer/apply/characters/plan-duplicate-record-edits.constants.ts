/* @layer bridge-wasm @kind constants */
import { NEXT_BYTES, OFF_NEXT, OFF_XP, XP_BYTES } from './level-record.constants';

const CHAR_BASE_TABLE = 'ctCharBase';
const KIND_BYTE = 0;

const ORIGINAL_KEEP_RANGES: readonly (readonly [number, number])[] = [
  [OFF_XP, XP_BYTES],
  [OFF_NEXT, NEXT_BYTES],
];

export { CHAR_BASE_TABLE, KIND_BYTE, ORIGINAL_KEEP_RANGES };
