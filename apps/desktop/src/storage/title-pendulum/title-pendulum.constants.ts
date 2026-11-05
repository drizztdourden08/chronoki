/* @layer renderer-lib @kind constants */
const PENDULUM_FILE_SUFFIX = '.pendulum.png';

const PACK_MAGIC = 'CTAS';

const PACK_HEADER_BYTES = 12;

const PACK_DIR_BYTES = 16;

const PACK_TABLE = 65;

const PACK_DEFINES = 67;

const PENDULUM_TABLES = { chr: 'ctTitleM7Chr', map: 'ctTitleM7Map', palette: 'ctTitlePal0' } as const;

const PENDULUM_TABLE_NAMES: readonly string[] = Object.values(PENDULUM_TABLES);

const PENDULUM_DEFINES = {
  tiles: 'CT_TITLE_M7_TILES',
  row0: 'CT_TITLE_M7_MAP_R0',
  col0: 'CT_TITLE_M7_MAP_C0',
  cols: 'CT_TITLE_M7_MAP_W',
  rows: 'CT_TITLE_M7_MAP_H',
  pivotX: 'CT_TITLE_M7_X',
  pivotY: 'CT_TITLE_M7_Y',
} as const;

const M7_TILE_PX = 8;

const M7_TILE_BYTES = 64;

const PALETTE_COLOURS = 256;

const PNG_WIDTH_AT = 16;

const PNG_HEIGHT_AT = 20;

export {
  M7_TILE_BYTES,
  M7_TILE_PX,
  PACK_DEFINES,
  PACK_DIR_BYTES,
  PACK_HEADER_BYTES,
  PACK_MAGIC,
  PACK_TABLE,
  PALETTE_COLOURS,
  PENDULUM_DEFINES,
  PENDULUM_FILE_SUFFIX,
  PENDULUM_TABLES,
  PENDULUM_TABLE_NAMES,
  PNG_HEIGHT_AT,
  PNG_WIDTH_AT,
};
