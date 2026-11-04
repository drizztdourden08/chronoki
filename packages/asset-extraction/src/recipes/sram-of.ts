/* @layer shared-asset-extraction @kind logic */
import { SRAM_BYTES } from './recipe-store.constants';

const sramOf = (state: Uint8Array): Uint8Array => state.slice(-SRAM_BYTES);

export { sramOf };
