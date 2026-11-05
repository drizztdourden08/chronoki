/* @layer renderer-components @kind logic */
import { SNES_BUTTONS } from '@chronoki/input-mapping';
import type { SnesButton } from '@chronoki/input-mapping';

const isSnesButton = (value: string): value is SnesButton => SNES_BUTTONS.some((button) => button === value);

export { isSnesButton };
