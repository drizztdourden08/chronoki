/* @layer shared-asset-extraction @kind logic */
import type { Mon, GatoStep } from './anim-tables.type';
import type { Sprite } from '../shared/oam-decode.type';
import { inView } from './in-view';
import { BRACKET_TILE, GATO_REF } from './anim-consts.constants';

const gatoIdleTable = (mon: Mon): GatoStep[] => {
  const armState = (sprites: Sprite[]): number => {
    const c = sprites.filter((s) => s.tile === 0x68 && s.pal === 1);
    if (!c.length) return 0;
    const on = sprites.filter((s) => inView(s) && s.pal === 1);
    const ay = Math.min(...on.map((s) => s.y));
    return (c[0] as Sprite).y - ay > 25 ? 1 : 0;
  };
  const rows: GatoStep[] = [];
  for (let F = 384; F < 505; F += 1) {
    const sprites = mon.get(F);
    if (!sprites) continue;
    const on = sprites.filter((s) => inView(s) && s.pal === 1 && s.tile !== BRACKET_TILE);
    if (!on.length) continue;
    const ax = Math.min(...on.map((s) => s.x));
    const ay = Math.min(...on.map((s) => s.y));
    rows.push([F, ax - GATO_REF[0], ay - GATO_REF[1], armState(sprites), 0]);
  }
  return rows;
};

export { gatoIdleTable };
