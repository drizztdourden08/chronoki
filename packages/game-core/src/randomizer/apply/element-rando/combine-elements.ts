/* @layer bridge-wasm @kind logic */
import type { Element } from './element-rando.type';

const combineElements = (elements: readonly Element[]): Element => {
  const kinds = new Set(elements);
  if (kinds.size === 1) return elements[0] ?? 'shadow';
  if (kinds.size === 2 && kinds.has('lightning') && kinds.has('water')) return 'lightning';
  return 'shadow';
};

export { combineElements };
