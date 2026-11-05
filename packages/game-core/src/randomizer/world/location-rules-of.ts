/* @layer bridge-wasm @kind logic */
import type { WorldLocation } from '@drizztdourden08/brock-randomizer/world';
import type { CtRule } from './ct-region-spec.type';
import type { CtWorldKeys } from './ct-world-keys.type';
import type { PinnedSource } from './pinned-source.type';
import { storyGiftRulesOf } from './story/story-gift-rules-of';

const locationRulesOf = (
  base: ReadonlyMap<string, CtRule>, treasure: readonly WorldLocation<CtWorldKeys>[], sources: readonly PinnedSource[],
): Map<string, CtRule> => new Map([
  ...base,
  ...storyGiftRulesOf(base, treasure),
  ...sources.map((source): [string, CtRule] => [source.key, source.rule]),
]);

export { locationRulesOf };
