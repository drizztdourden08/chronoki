/* @layer bridge-wasm @kind logic */
import { chronokiCore } from '../../lifecycle/chronoki-core';

type ApCalls = ReturnType<typeof chronokiCore.calls>;

const apCallsOrNull = (): ApCalls | null => {
  try {
    return chronokiCore.calls();
  } catch {
    return null;
  }
};

const apCall = (name: string, ...args: number[]): boolean => {
  const calls = apCallsOrNull();
  if (calls === null || !calls.has(name)) return false;
  try {
    calls.call(name, ...args);
    return true;
  } catch {
    return false;
  }
};

const apNumber = (name: string, ...args: number[]): number | null => {
  const calls = apCallsOrNull();
  if (calls === null || !calls.has(name)) return null;
  try {
    return calls.number(name, ...args);
  } catch {
    return null;
  }
};

export { apCall, apCallsOrNull, apNumber };
export type { ApCalls };
