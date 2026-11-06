/* @layer bridge-wasm @kind logic */
import { chronokiApCollectedSet } from './chronoki-ap-collected-set';

const chronokiApCollected = (): ReadonlySet<string> => chronokiApCollectedSet;

export { chronokiApCollected };
