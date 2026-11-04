/* @layer bridge-wasm @kind logic */
import { encodeSaveSlot } from '@drizztdourden08/brock-port-kit';
import { captureEngineState } from './capture-engine-state';
import type { Captured } from './capture-state.type';
import type { SaveStateContext } from './save-state.type';

const captureState = async (ctx: SaveStateContext): Promise<Captured> => {
  const captured = await captureEngineState(ctx);
  if (!captured.ok) return captured;
  const meta = { port: ctx.core.definition.id, savedAt: Date.now(), rom: ctx.romFile };
  return { ok: true, bytes: encodeSaveSlot({ meta, state: captured.state }) };
};

export { captureState };
