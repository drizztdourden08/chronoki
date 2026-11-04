/* @layer shared-asset-extraction @kind logic */
import type { Mon, CronoStep } from './anim-tables.type';
import { KEYS, CRONO_REF } from './anim-consts.constants';
import { clusterSig } from './cluster-sig';

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

export { cronoAttackTable };
