/* @layer bridge-wasm @kind logic */
import { apCallsOrNull } from './ap-calls-or-null';

const apNumber = (name: string, ...args: number[]): number | null => {
  const calls = apCallsOrNull();
  if (!calls?.has(name)) return null;
  try {
    return calls.number(name, ...args);
  } catch {
    return null;
  }
};

export { apNumber };
