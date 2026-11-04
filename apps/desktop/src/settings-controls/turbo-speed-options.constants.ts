/* @layer renderer-app @kind data */
import { TURBO_SPEEDS } from '@app/game/turbo/turbo.constants';

const TURBO_SPEED_OPTIONS = TURBO_SPEEDS.map((speed) => ({ value: String(speed), label: `${speed}x` }));

export { TURBO_SPEED_OPTIONS };
