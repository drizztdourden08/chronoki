/* @layer shared-asset-extraction @kind logic */
import type { MonitorRequest } from '../../oracle/peek.type';
import { MONITOR_REGIONS } from './anim-sprites.constants';

const monitorRequest = (state: Uint8Array, script: string): MonitorRequest => ({
  state,
  regions: MONITOR_REGIONS,
  script,
});

export { monitorRequest };
