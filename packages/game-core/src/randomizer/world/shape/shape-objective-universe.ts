/* @layer bridge-wasm @kind logic */
import { collectObjectivesOf } from '../bucket/collect-objectives-of';
import { FLAG_OBJECTIVES } from '../bucket/flag-objectives.constants';
import type { ObjectiveDef } from '../bucket/objective-def.type';
import type { CtKeyItem } from '../ct-world-keys.type';
import { shapeRecruitObjectives } from './shape-recruit-objectives';
import { SHAPE_MODES } from './shape.constants';

const shapeKeyItems = (): CtKeyItem[] =>
  [...new Set<CtKeyItem>([...SHAPE_MODES.flatMap((mode) => mode.keyItems), 'jets-of-time'])];

const shapeObjectiveUniverse = (): ObjectiveDef[] => {
  const everything = [...FLAG_OBJECTIVES, ...shapeRecruitObjectives(), ...collectObjectivesOf(shapeKeyItems())];
  return everything.filter((objective, i) => everything.findIndex((other) => other.id === objective.id) === i);
};

export { shapeObjectiveUniverse };
