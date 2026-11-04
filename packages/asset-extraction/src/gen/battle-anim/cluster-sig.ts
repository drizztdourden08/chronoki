/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode.type';
import { inView } from './in-view';
import { hex } from '../c-hex';

const clusterSig = (sprites: Sprite[], pal: number): [number, number, string] | null => {
  const on = sprites.filter((s) => inView(s) && s.pal === pal);
  if (!on.length) return null;
  const ax = Math.min(...on.map((s) => s.x));
  const ay = Math.min(...on.map((s) => s.y));
  const parts = [...on]
    .sort((a, b) => a.tile - b.tile)
    .map((s) => `${hex(s.tile, 3)}@(${s.x - ax},${s.y - ay})${s.vflip ? 'V' : ''}${s.hflip ? 'H' : ''}`);
  return [ax, ay, parts.join(' ')];
};

export { clusterSig };
