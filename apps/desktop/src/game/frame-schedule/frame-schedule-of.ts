/* @layer bridge-wasm @kind logic */
import { frameScheduleState } from './frame-schedule-state';

const frameScheduleOf = (): 'display' | 'timer' => (frameScheduleState.vsync ? 'display' : 'timer');

export { frameScheduleOf };
