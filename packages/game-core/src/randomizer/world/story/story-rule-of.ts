/* @layer bridge-wasm @kind logic */
import { CT_KIT } from '../ct-kit.constants';
import type { CtRule } from '../ct-region-spec.type';
import { STORY_WRITERS } from './story-writers.constants';

const storyRuleOf = (stage: number): CtRule =>
  CT_KIT.any(...STORY_WRITERS.filter((writer) => writer.stage >= stage).map((writer) => writer.rule));

export { storyRuleOf };
