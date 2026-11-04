/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import type { FunctionAction } from '@chronoki/input-mapping';
import { FUNCTION_ACTION_GATES } from '../GameSession.constants';
import { FUNCTION_HANDLERS } from './function-handlers';

const runFunctionAction = async (action: FunctionAction): Promise<void> => {
  const gate = FUNCTION_ACTION_GATES[action];
  if (gate && !hostGate(gate)) return;
  await FUNCTION_HANDLERS[action]?.();
};

export { runFunctionAction };
