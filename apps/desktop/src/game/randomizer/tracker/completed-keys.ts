/* @layer bridge-wasm @kind logic */
import { localRunHolder } from '../local-run-holder';

const completedKeys = (): ReadonlySet<string> => new Set(localRunHolder.run?.received.map((entry) => entry.checkId) ?? []);

export { completedKeys };
