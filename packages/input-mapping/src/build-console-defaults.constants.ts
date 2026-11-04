/* @layer shared-input @kind constants */
import type { SdlAxisName } from '@drizztdourden08/brock-input';

const AXIS_DIRECTIONS = ['-', '+'] as const;

const AXIS_INDEX: Readonly<Record<SdlAxisName, number>> = {
  LEFT_X: 0,
  LEFT_Y: 1,
  RIGHT_X: 2,
  RIGHT_Y: 3,
  LEFT_TRIGGER: 4,
  RIGHT_TRIGGER: 5,
};

const AXIS_POSITIONS = Object.keys(AXIS_INDEX) as SdlAxisName[];

export { AXIS_DIRECTIONS, AXIS_INDEX, AXIS_POSITIONS };
