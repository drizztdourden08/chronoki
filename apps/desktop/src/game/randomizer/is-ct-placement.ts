/* @layer bridge-wasm @kind logic */
import type { CtPlacement } from '@chronoki/game-core';

const isCtPlacement = (raw: unknown): raw is CtPlacement => {
  if (typeof raw !== 'object' || raw === null) return false;
  const { seed, locations } = raw as Partial<CtPlacement>;
  return typeof seed === 'string' && Array.isArray(locations);
};

export { isCtPlacement };
