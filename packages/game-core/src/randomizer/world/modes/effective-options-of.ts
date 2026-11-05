/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import { modeOf } from './mode-of';

const effectiveOptionsOf = (options: CtOptionValues = {}): CtOptionValues => ({
  ...options,
  ...modeOf(options).forcedOptions,
});

export { effectiveOptionsOf };
