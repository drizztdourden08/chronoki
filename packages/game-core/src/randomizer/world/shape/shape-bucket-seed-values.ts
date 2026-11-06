/* @layer bridge-wasm @kind logic */
import { SHAPE_BUCKET_NEEDED_KEY, SHAPE_BUCKET_OPEN_KEY } from './shape-bucket.constants';
import type { ShapeBucketValues } from './shape-bucket-values.type';
import { shapeObjectiveKey } from './shape-objective-key';
import { shapeObjectiveUniverse } from './shape-objective-universe';

const shapeBucketSeedValues = ({ objectives, needed }: ShapeBucketValues): Record<string, string | number | boolean> => {
  const rolled = new Set(objectives.map((objective) => objective.id));
  const values: Record<string, string | number | boolean> = {
    [SHAPE_BUCKET_OPEN_KEY]: objectives.length > 0,
    [SHAPE_BUCKET_NEEDED_KEY]: needed,
  };
  for (const objective of shapeObjectiveUniverse()) values[shapeObjectiveKey(objective.id)] = rolled.has(objective.id);
  return values;
};

export { shapeBucketSeedValues };
