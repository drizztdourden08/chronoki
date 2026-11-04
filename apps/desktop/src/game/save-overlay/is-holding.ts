/* @layer bridge-wasm @kind logic */
import { hold } from './save-hold.state';

const isHolding = (): boolean => hold.start !== null;

export { isHolding };
