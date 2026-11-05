/* @layer renderer-components @kind logic */
import { loadFromSlot, saveToSlot } from '@app/views/GameSession';
import { appLog } from '@app/log/app-log';
import { TAP_THRESHOLD_MS } from '../SaveStateOverlay.constants';
import type { ShortcutContext } from '../SaveStateOverlay.type';
import { buildIdleHints } from './build-idle-hints';
import { withPauseGuard } from './with-pause-guard';
import { cancelHold } from './cancel-hold';
import { heldMs } from './held-ms';
import { slotOfAction } from './slot-of-action';

const handleFunctionKeyUp = (ctx: ShortcutContext, action: string): void => {
  if (!ctx.enabled || !ctx.isOpen.current) return;
  if (!ctx.hold.awaiting) return;

  const slot = slotOfAction(action);
  if (slot === undefined || ctx.hold.slot !== slot) return;

  const elapsed = heldMs(ctx.hold, ctx.holdDurationMs);

  if (ctx.hold.complete || elapsed >= ctx.holdDurationMs) {
    cancelHold(ctx);
    appLog.info(`[Enhanced] Save to slot ${slot}`);
    void withPauseGuard(() => saveToSlot(slot)).then(() => ctx.close());
  } else if (elapsed < TAP_THRESHOLD_MS) {
    cancelHold(ctx);
    appLog.info(`[Enhanced] Load from slot ${slot}`);
    void withPauseGuard(() => loadFromSlot(slot)).then(() => ctx.close());
  } else {
    cancelHold(ctx);
    ctx.setHints(buildIdleHints(ctx.mappings, slot));
  }
};

export { handleFunctionKeyUp };
