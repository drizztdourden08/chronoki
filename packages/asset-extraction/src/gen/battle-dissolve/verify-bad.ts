/* @layer shared-asset-extraction @kind logic */
import type { Seq } from './dissolve-measure.type';
import { at } from './seq-at';
import { KEY_ORDER } from './dissolve-sprite.constants';

const verifyBad = (seq: Seq, start: number, dither: number[][]): { bad: number; tot: number } => {
  const base = at(seq, start);
  let bad = 0;
  let tot = 0;
  for (const n of [...seq.keys()].sort((a, b) => a - b)) {
    if (n < start) continue;
    const step = n - start;
    const cur = at(seq, n);
    for (const k of KEY_ORDER) {
      const v = base[k] as number;
      const cell = (dither[Math.floor(k / 32) % 8] as number[])[(k % 32) % 8] as number;
      tot += 1;
      if ((cell >= step ? v : 0) !== cur[k]) bad += 1;
    }
  }
  return { bad, tot };
};

export { verifyBad };
