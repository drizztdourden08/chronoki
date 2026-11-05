/* @layer bridge-wasm @kind constants */
const CTAS_TYPE_SCENE_HEADER = 3;
const CTAS_TYPE_SCRIPT = 16;
const SCENE_HEADER_SCRIPT_AT = 8;
const SCENE_LOCATIONS = 0x200;
const OBJECT_FUNCTIONS = 16;
const OBJECT_HEADER_BYTES = 32;
const OP_ADD_ITEM = 0xca;
const GIFT_ID_PREFIX = 'gift';
const OP_LENGTHS: readonly number[] = [
  1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 5, 6, 5, 5, 5, 1, 3, 2, 3, 1, 2, 1, 2, 2,
  2, 4, 4, 3, 3, 2, 2, 3, 3, 2, 1, 1, 3, 2, 1, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 3, 2,
  2, 2, 2, 2, 2, 3, 3, 2, 5, 5, 5, 6, 5, 5, 1, 3, 4, 3, 3, 4, 4, 2, 4, 1, 4, 4, 2, 3, 1, 3, 3, 3,
  4, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 1, 1, 5, 3, 3, 2, 2, 2, 3, 2, 2, 2, 3, 1, 4, 5, 2, 2, 1, 2,
  2, 2, 2, 3, 2, 1, 1, 2, 1, 2, 2, 3, 3, 5, 2, 2, 1, 1, 3, 1, 2, 2, 3, 3, 3, 3, 4, 1, 3, 3, 2, 2,
  3, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4, 1, 1, 2, 1, 1, 1, 1,
  3, 2, 2, 3, 3, 2, 1, 2, 2, 3, 2, 2, 4, 3, 3, 3, 2, 2, 3, 2, 2, 3, 2, 3, 3, 7, 1, 1, 5, 5, 5, 5,
  5, 5, 5, 2, 8, 8, 5, 3, 2, 1, 2, 3, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 18, 1,
];

export {
  CTAS_TYPE_SCENE_HEADER, CTAS_TYPE_SCRIPT, GIFT_ID_PREFIX, OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES, OP_ADD_ITEM,
  OP_LENGTHS, SCENE_HEADER_SCRIPT_AT, SCENE_LOCATIONS,
};
