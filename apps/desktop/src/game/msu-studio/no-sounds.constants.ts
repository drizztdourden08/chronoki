/* @layer bridge-wasm @kind constants */
import type { MsuSoundSource } from '@drizztdourden08/brock-msu/renderer';

const NO_SOUNDS: MsuSoundSource = {
  list: () => [],
  name: () => null,
};

export { NO_SOUNDS };
