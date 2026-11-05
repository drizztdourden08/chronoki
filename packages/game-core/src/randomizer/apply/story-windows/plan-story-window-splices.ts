/* @layer bridge-wasm @kind logic */
import type { Placement } from '../apply-seed.type';
import { opEquals } from '../modes/op-equals';
import type { ScriptSplice } from '../script/script-splice.type';
import { giveIfMissing } from './give-if-missing';
import { isWindowKeyItem } from './is-window-key-item';
import { STORY_WINDOW_GIFTS } from './story-window-gifts.constants';

const planStoryWindowSplices = (placement: Placement): ScriptSplice[] =>
  STORY_WINDOW_GIFTS.flatMap((gift) => {
    const item = placement[gift.check];
    if (item === undefined || !isWindowKeyItem(item)) return [];
    return [{
      scene: gift.scene,
      scope: gift.scope,
      anchor: opEquals(gift.anchor),
      replace: Uint8Array.from([...gift.before, ...giveIfMissing(item), ...gift.after]),
      why: gift.why,
    }];
  });

export { planStoryWindowSplices };
