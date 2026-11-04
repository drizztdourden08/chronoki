/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode.type';
import { dec } from '../shared/py-format';
import { hex } from '../c-text';

const objLine = (s: Sprite): string =>
  `  { ${dec(s.idx, 3)}, ${dec(s.x, 4)}, ${dec(s.y, 3)}, 0x${hex(s.tile, 3)}, ${s.pal}, ${s.prio}, ${s.hflip}, ${s.vflip} },\n`;

export { objLine };
