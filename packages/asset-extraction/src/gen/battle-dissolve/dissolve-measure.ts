/* @layer shared-asset-extraction @kind logic */
import { KEY_ORDER } from './dissolve-sprite.constants';
import type { Seq } from './dissolve-measure.type';
import { at } from './seq-at';

const fmt = (k: number): string => `(${k % 32}, ${Math.floor(k / 32)})`;

const findStart = (seq: Seq, frames: number[]): number => {
  for (let i = 1; i < frames.length; i += 1) {
    const a = at(seq, frames[i - 1] as number);
    const b = at(seq, frames[i] as number);
    const cleared = KEY_ORDER.some((k) => a[k] && !b[k]);
    const changed = KEY_ORDER.some((k) => b[k] && b[k] !== a[k]);
    if (cleared && !changed) return frames[i - 1] as number;
  }
  throw new Error(`battle_dissolve: no dissolve in peek frames ${frames[0]}..${frames[frames.length - 1]}`);
};

const clearSteps = (seq: Seq, start: number, lastFrame: number): Map<number, number> => {
  const base = at(seq, start);
  const last = new Map<number, number>();
  for (const k of KEY_ORDER) {
    const v = base[k] as number;
    if (!v) continue;
    let n = start;
    while (seq.has(n + 1) && (at(seq, n + 1)[k] as number) === v) n += 1;
    if (!seq.has(n + 1)) throw new Error(`battle_dissolve: pixel ${fmt(k)} still present at the window end`);
    for (let m = n + 1; m <= lastFrame; m += 1) {
      if (at(seq, m)[k]) throw new Error(`battle_dissolve: pixel ${fmt(k)} comes back after it cleared`);
    }
    last.set(k, n - start);
  }
  return last;
};

const ditherOf = (last: Map<number, number>): number[][] => {
  const dither: (number | null)[][] = Array.from({ length: 8 }, () => new Array<number | null>(8).fill(null));
  for (const [k, step] of last) {
    const gx = k % 32;
    const gy = Math.floor(k / 32);
    const row = dither[gy % 8] as (number | null)[];
    const c = row[gx % 8] as number | null;
    if (c !== null && c !== step) {
      throw new Error(`battle_dissolve: cell (${gx % 8},${gy % 8}) disagrees: step ${c} and ${step}`);
    }
    row[gx % 8] = step;
  }
  if (dither.some((row) => row.some((v) => v === null))) {
    throw new Error('battle_dissolve: a dither cell has no inked pixel to measure it');
  }
  return dither as number[][];
};

const measure = (seq: Seq): { start: number; dither: number[][] } => {
  const frames = [...seq.keys()].sort((a, b) => a - b);
  const lastFrame = frames[frames.length - 1] as number;
  const start = findStart(seq, frames);
  return { start, dither: ditherOf(clearSteps(seq, start, lastFrame)) };
};

export { measure };
