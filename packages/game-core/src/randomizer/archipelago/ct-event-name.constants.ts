/* @layer bridge-wasm @kind constants */
import { objectiveEventIdOf } from '../world/bucket/objective-event-id-of';
import { shapeObjectiveUniverse } from '../world/shape/shape-objective-universe';

const CT_EVENT_NAME_PREFIX = 'Event - ';

const CT_EVENT_NAMES: Readonly<Record<string, string>> = {
  'ck-goal': 'Goal reached',
  'beat-lavos': 'Beat Lavos',
  'beat-ozzie': 'Beat Ozzie',
  'cyrus-done': 'Cyrus avenged',
  'beat-giga-gaia': 'Beat Giga Gaia',
  'kings-trial-done': "King's Trial done",
  masamune: 'Masamune forged',
  magus: 'Magus recruited',
  ...Object.fromEntries(
    shapeObjectiveUniverse().map((objective) => [objectiveEventIdOf(objective.id), `Objective - ${objective.label}`]),
  ),
};

export { CT_EVENT_NAME_PREFIX, CT_EVENT_NAMES };
