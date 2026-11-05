/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from '../lifecycle/active-game-holder';
import { frameScheduleOf } from './frame-schedule-of';
import { frameScheduleState } from './frame-schedule-state';

const applyFrameSchedule = (vsync: boolean): void => {
  frameScheduleState.vsync = vsync;
  activeGameHolder.current?.session.setSchedule(frameScheduleOf());
};

export { applyFrameSchedule };
