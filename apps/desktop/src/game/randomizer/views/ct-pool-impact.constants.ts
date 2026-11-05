/* @layer bridge-wasm @kind constants */
import type { CtPoolImpact } from './ct-pool-impact.type';

const UNAVAILABLE: CtPoolImpact = { locations: 0, items: 0, note: 'n/a' };

const NO_CHANGE: CtPoolImpact = { locations: 0, items: 0, note: '' };

export { NO_CHANGE, UNAVAILABLE };
