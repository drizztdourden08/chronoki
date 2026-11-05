/* @layer bridge-wasm @kind logic */
import { callIfExported } from './call-if-exported';
import type { LiveCalls } from './live-settings.type';

const tryVoidCcall = (calls: LiveCalls | null, fn: string, value: number): void => {
  if (!calls) return;
  callIfExported(() => {
    if (calls.has(fn)) calls.call(fn, value);
  });
};

export { tryVoidCcall };
