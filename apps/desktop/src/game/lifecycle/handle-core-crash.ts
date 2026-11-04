/* @layer bridge-wasm @kind logic */
import type { CoreCrash } from '@drizztdourden08/brock-port-kit/renderer';
import { isCleanExit } from './is-clean-exit';

const handleCoreCrash = ({ error, message }: CoreCrash): void => {
  if (isCleanExit(error)) return;
  console.error(`[core] ${message}`);
};

export { handleCoreCrash };
