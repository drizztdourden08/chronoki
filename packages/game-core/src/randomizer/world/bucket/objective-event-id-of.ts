/* @layer bridge-wasm @kind logic */
import type { CtEventId } from '../ct-world-keys.type';
import { OBJECTIVE_EVENT_PREFIX } from './bucket.constants';

const objectiveEventIdOf = (id: string): CtEventId => `${OBJECTIVE_EVENT_PREFIX}${id}`;

export { objectiveEventIdOf };
