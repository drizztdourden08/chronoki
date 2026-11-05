/* @layer renderer-components @kind logic */
import type { FunctionAction } from '@chronoki/input-mapping';
import { appLog } from '@app/log/app-log';
import { SLOT_ACTIONS, SLOT_COUNT } from '../SaveStateOverlay.constants';
import type { InputManager, ShortcutContext, SlotActionSpec } from '../SaveStateOverlay.type';
import { withPauseGuard } from './with-pause-guard';
import { handleSlotAction } from './handle-slot-action';

const onSlotAction = (ctx: ShortcutContext, action: SlotActionSpec, slot: number): void => {
  if (!ctx.enabled) {
    appLog.info(`[${action.label}] ${action.verb} slot ${slot}`);
    void withPauseGuard(() => action.run(slot));
    return;
  }
  handleSlotAction(ctx, slot);
};

const registerSlotActions = (ctx: ShortcutContext, inputMgr: InputManager): (() => void)[] => {
  const unsubs: (() => void)[] = [];
  for (let i = 1; i <= SLOT_COUNT; i++) {
    for (const action of SLOT_ACTIONS) {
      unsubs.push(inputMgr.onFunctionAction(`${action.prefix}-${i}` as FunctionAction, () => onSlotAction(ctx, action, i - 1)));
    }
  }
  return unsubs;
};

export { registerSlotActions };
