/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode';
import { inView } from './in-view';
import { BRACKET_TILE } from './anim-consts.constants';

const combatant = (sprites: Sprite[], pal: number): Sprite[] =>
  sprites.filter((s) => inView(s) && s.pal === pal && s.tile !== BRACKET_TILE).sort((a, b) => a.idx - b.idx);

export { combatant };
