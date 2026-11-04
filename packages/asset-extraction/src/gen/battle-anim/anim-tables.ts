/* @layer shared-asset-extraction @kind logic */
import type { Sprite } from '../shared/oam-decode';
import { BRACKET_TILE, CRONO_REF, GATO_REF, KEYS } from './anim-consts';
import { clusterSig, inView } from './anim-sprites';

type Mon = Map<number, Sprite[]>;
type CronoStep = [F: number, dx: number | null, dy: number | null, pose: number];
type GatoStep = [F: number, dx: number, dy: number, arm: number, footDY: number];
type BobStep = [F: number, dx: number, dy: number, state: number];

const cronoAttackTable = (mon: Mon): CronoStep[] => {
  const keysig = new Map<string | null, number>();
  KEYS.filter((key) => key.name === 'Crono').forEach((key, pid) => {
    const sprites = mon.get(key.repFrame);
    if (sprites) keysig.set(clusterSig(sprites, 5)?.[2] ?? null, pid);
  });
  const rows: CronoStep[] = [];
  for (let F = 440; F < 531; F += 1) {
    const sprites = mon.get(F);
    if (!sprites) continue;
    const sig = clusterSig(sprites, 5);
    if (!sig) {
      rows.push([F, null, null, -2]);
      continue;
    }
    rows.push([F, sig[0] - CRONO_REF[0], sig[1] - CRONO_REF[1], keysig.get(sig[2]) ?? -1]);
  }
  return rows;
};

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

export type { BobStep, CronoStep, GatoStep, Mon };
export { cronoAttackTable, cronoBobTable, gatoIdleTable };
