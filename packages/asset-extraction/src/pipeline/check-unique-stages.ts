/* @layer shared-asset-extraction @kind logic */
import type { ImportStage } from './stage.type';

const checkUnique = (stages: ImportStage[]): void => {
  const seen = new Set<string>();
  for (const s of stages) {
    if (seen.has(s.id)) throw new Error(`stage id ${s.id} is defined twice`);
    seen.add(s.id);
  }
};

export { checkUnique };
