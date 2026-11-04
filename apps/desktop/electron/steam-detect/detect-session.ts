/* @layer electron-main @kind logic */
import type { DetectSession } from './detect-session.type';

const detectSession: DetectSession = {
  state: 'idle',
  control: { visits: 0, cancelled: false, limit: 0 },
  allowed: null,
};

export { detectSession };
