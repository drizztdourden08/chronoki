/* @layer shared-asset-extraction @kind logic */
import type { AnimTables } from './sprite-anims.type';
import { wordAt } from './bytes/word-at';
import { SPRITE_META } from './sprite-anims.constants';

const animTablesCache = new WeakMap<Uint8Array, AnimTables>();

const spriteAnimTables = (rom: Uint8Array): AnimTables => {
  const hit = animTablesCache.get(rom);
  if (hit) return hit;
  const p2 = 0x240000 + wordAt(rom, SPRITE_META + 4);
  const p3 = 0x240000 + wordAt(rom, SPRITE_META + 6);
  const tables = {
    fp: Array.from({ length: 194 }, (_, i) => 0x240000 + wordAt(rom, p2 + i * 2)),
    dp: Array.from({ length: 194 }, (_, i) => 0x240000 + wordAt(rom, p3 + i * 2)),
  };
  animTablesCache.set(rom, tables);
  return tables;
};

export { spriteAnimTables };
