/* @layer bridge-wasm @kind logic */
import type { CtOptionValues } from '../ct-world-input.type';
import { modeOf } from '../modes/mode-of';
import { rollMysteryOptions } from './roll-mystery-options';

const resolveMysteryOptions = (options: CtOptionValues, seed: string): CtOptionValues => {
  if (options.mysterySeed !== true) return options;
  const rolled = { ...options, ...rollMysteryOptions(seed) };
  return { ...rolled, ...modeOf(rolled).forcedOptions };
};

export { resolveMysteryOptions };
