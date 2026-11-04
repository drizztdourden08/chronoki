/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { readHeapText } from '../state-buffers';

const cache = new Map<string, string>();

const cachedName = (calls: CoreCalls, exportName: string, id: number): string => {
  const key = `${exportName}:${id}`;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  if (!calls.has(exportName)) return '';
  const ptr = calls.number(exportName, id);
  const text = ptr ? readHeapText(calls, ptr) : '';
  if (text) cache.set(key, text);
  return text;
};

export { cachedName };
