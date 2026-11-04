/* @layer shared-asset-extraction @kind constants */
const HEADER = [
  '// GENERATED (menu_itemuse gen) -- item-menu Use/Organize data, ROM-free bake.',
  '// ctItemProp = oracle $7E7700 static item-property table (bit1=field-usable, bit3=key-item).',
  '// ctItemFx*  = ROM effect table $CC:05CC + scope $CC:1BB5 decoded (Tonic oracle-validated).',
  '#ifndef CT_MENU_ITEMUSE_H',
  '#define CT_MENU_ITEMUSE_H',
  '#include <stdint.h>',
  '',
  '// $7700[id] for id 0x00..0xF2 (static per-item props). bit1(0x02)=usable, bit3(0x08)=key.',
  'static const uint8_t ctItemProp[0xF3] = {',
];

export { HEADER };
