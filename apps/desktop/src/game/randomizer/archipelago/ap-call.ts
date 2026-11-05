/* @layer bridge-wasm @kind logic */
import { apCallsOrNull } from './ap-calls-or-null';

const apCall = (name: string, ...args: number[]): boolean => {
  const calls = apCallsOrNull();
  if (!calls?.has(name)) return false;
  try {
    calls.call(name, ...args);
    return true;
  } catch {
    return false;
  }
};

export { apCall };
