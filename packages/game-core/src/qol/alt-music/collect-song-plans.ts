/* @layer bridge-wasm @kind logic */
import type { QolPlan } from '../qol.type';
import type { SongPlan } from './alt-music.type';

const collectSongPlans = (plans: readonly SongPlan[]): QolPlan => {
  const failed = plans.flatMap((p) => (p.failed === null ? [] : [p.failed]));
  if (failed.length > 0) return { edits: [], failed };
  return { edits: plans.flatMap((p) => (p.edit ? [p.edit] : [])), failed };
};

export { collectSongPlans };
