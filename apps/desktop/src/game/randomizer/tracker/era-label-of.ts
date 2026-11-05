/* @layer bridge-wasm @kind logic */
import { CT_ERA_LABELS } from '@chronoki/game-core';
import { indexOfChecks } from './location-index';

const eraLabelOf = (location: string): string => CT_ERA_LABELS[indexOfChecks().eraOf.get(location) ?? 'none'];

export { eraLabelOf };
