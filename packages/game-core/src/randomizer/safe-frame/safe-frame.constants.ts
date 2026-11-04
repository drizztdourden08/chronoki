/* @layer bridge-wasm @kind constants */
import { CLOCK_FROZEN_FLAG } from '../../game-info/wram-map.constants';

const SAFE_FRAME_BUSY_BYTES: readonly number[] = [CLOCK_FROZEN_FLAG];

export { SAFE_FRAME_BUSY_BYTES };
