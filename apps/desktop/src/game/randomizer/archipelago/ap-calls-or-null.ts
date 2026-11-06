/* @layer bridge-wasm @kind logic */
import { chronokiCore } from '../../lifecycle/chronoki-core';
import type { ApCalls } from './ap-calls.type';

const apCallsOrNull = (): ApCalls | null => {
  try {
    return chronokiCore.calls();
  } catch {
    return null;
  }
};

export { apCallsOrNull };
