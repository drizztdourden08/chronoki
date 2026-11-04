/* @layer shared-input @kind constants */
import { SDL_AXIS } from '@drizztdourden08/brock-input';
import type { SdlAxisName } from '@drizztdourden08/brock-input';

const AXIS_DIRECTIONS = ['-', '+'] as const;

const AXIS_POSITIONS = Object.keys(SDL_AXIS) as SdlAxisName[];

export { AXIS_DIRECTIONS, AXIS_POSITIONS };
