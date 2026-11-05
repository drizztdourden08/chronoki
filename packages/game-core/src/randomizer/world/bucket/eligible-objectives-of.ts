/* @layer bridge-wasm @kind logic */
import { keyItemsOf } from '../epoch-fail/key-items-of';
import type { CtOptionValues } from '../ct-world-input.type';
import { applyModeToRegions } from '../modes/apply-mode-to-regions';
import { modeOf } from '../modes/mode-of';
import type { CtStartParty } from '../party/ct-party.type';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import { collectObjectivesOf } from './collect-objectives-of';
import { FLAG_OBJECTIVES } from './flag-objectives.constants';
import type { ObjectiveDef } from './objective-def.type';
import { recruitObjectivesOf } from './recruit-objectives-of';

const eligibleObjectivesOf = (effective: CtOptionValues, party: CtStartParty): ObjectiveDef[] => {
  const mode = modeOf(effective);
  const kept = new Set(applyModeToRegions(CT_REGIONS, mode).map((spec) => spec.id));
  const keyItems = keyItemsOf(mode, effective.epochFail === true, effective.vanillaRoboRibbon === true);
  return [...FLAG_OBJECTIVES, ...recruitObjectivesOf(party, kept), ...collectObjectivesOf(keyItems)].filter((objective) =>
    kept.has('end-of-time')
    && objective.regions.every((id) => kept.has(id))
    && objective.items.every((item) => keyItems.includes(item))
    && (objective.option === undefined || effective[objective.option] === true));
};

export { eligibleObjectivesOf };
