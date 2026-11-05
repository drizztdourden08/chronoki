/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';
import type { CtWorldKeys } from '../ct-world-keys.type';
import { STORY_GATED_GIFTS } from './story-gated-gifts.constants';
import { storyRuleOf } from './story-rule-of';

const storyGiftRulesOf = (
  base: ReadonlyMap<string, CtRule>, treasure: readonly WorldLocation<CtWorldKeys>[],
): [string, CtRule][] => {
  const keys = new Set(treasure.map((location) => location.key));
  return STORY_GATED_GIFTS.filter((gift) => keys.has(gift.check)).map((gift): [string, CtRule] => {
    const story = storyRuleOf(gift.stage);
    const prior = base.get(gift.check);
    return [gift.check, prior === undefined ? story : CT_KIT.all(prior, story)];
  });
};

export { storyGiftRulesOf };
