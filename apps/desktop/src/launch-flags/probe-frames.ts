/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const probeFrames = (): number | null => {
  const raw = startupFlag('probe-frames');
  return typeof raw === 'string' && /^\d+$/.test(raw) && Number(raw) > 0 ? Number(raw) : null;
};

export { probeFrames };
