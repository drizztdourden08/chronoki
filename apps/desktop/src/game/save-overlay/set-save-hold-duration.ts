/* @layer bridge-wasm @kind logic */
import { holdDuration } from './hold-duration.state';

const setSaveHoldDuration = (seconds: number): void => {
  holdDuration.ms = Math.round(seconds * 1000);
};

export { setSaveHoldDuration };
