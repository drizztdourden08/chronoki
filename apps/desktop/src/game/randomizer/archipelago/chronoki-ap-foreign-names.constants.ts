/* @layer bridge-wasm @kind constants */
const CK_SET_FOREIGN_NAME = 'CkSetForeignName';
const CK_CLEAR_FOREIGN_NAMES = 'CkClearForeignNames';
const KIND_CHEST = 1;
const NAME_MAX = 40;
const CHEST_KEY = /^chest-([0-9a-f]{3})-(\d+)$/;
const NOT_CHARSET = /[^A-Za-z0-9 .,'!?-]/g;

export { CHEST_KEY, CK_CLEAR_FOREIGN_NAMES, CK_SET_FOREIGN_NAME, KIND_CHEST, NAME_MAX, NOT_CHARSET };
