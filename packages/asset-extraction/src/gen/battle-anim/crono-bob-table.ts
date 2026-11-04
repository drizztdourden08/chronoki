/* @layer shared-asset-extraction @kind logic */
import type { Mon, BobStep } from './anim-tables.type';
import { inView } from './in-view';
import { CRONO_REF } from './anim-consts.constants';

const cronoBobTable = (mon: Mon): BobStep[] => {
  const rows: BobStep[] = [];
  for (let F = 400; F < 505; F += 1) {
    const sprites = mon.get(F);
    if (!sprites) continue;
    const on = sprites.filter((s) => inView(s) && s.pal === 5);
    if (!on.length) continue;
    const ax = Math.min(...on.map((s) => s.x));
    const ay = Math.min(...on.map((s) => s.y));
    const a = on.find((s) => s.tile === 0x0a);
    const c = on.find((s) => s.tile === 0x0c);
    const ady = a ? a.y - ay : 0;
    const cdx = c ? c.x - ax : 0;
    let st = 0;
    if (ady >= 9) st = 1;
    else if (cdx >= 17) st = 2;
    rows.push([F, ax - CRONO_REF[0], ay - CRONO_REF[1], st]);
  }
  return rows;
};

export { cronoBobTable };
