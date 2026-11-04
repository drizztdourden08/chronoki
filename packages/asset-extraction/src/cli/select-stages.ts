/* @layer shared-asset-extraction @kind logic */
import type { ImportStage } from '../pipeline/stage.type';

const selectStages = (all: ImportStage[], only: string | undefined, from: string | undefined): ImportStage[] => {
  const known = new Set(all.map((s) => s.id));
  const wanted = only === undefined ? null : only.split(',').filter(Boolean);
  for (const id of [...(wanted ?? []), ...(from === undefined ? [] : [from])]) {
    if (!known.has(id)) throw new Error(`unknown stage id: ${id}`);
  }
  const start = from === undefined ? 0 : all.findIndex((s) => s.id === from);
  return all.filter((s, i) => i >= start && (wanted === null || wanted.includes(s.id)));
};

export { selectStages };
