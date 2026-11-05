/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import type { CtStartParty } from '../party/ct-party.type';
import type { ObjectiveRow } from './objective-def.type';
import { objectivesOf } from './objectives-of';

const objectiveRowsOf = (options: CtOptionValues | undefined, seed: string, party: CtStartParty): ObjectiveRow[] | undefined => {
  const objectives = objectivesOf(options, seed, party);
  return objectives.length === 0 ? undefined : objectives.map((objective) => ({ id: objective.id, label: objective.label }));
};

export { objectiveRowsOf };
