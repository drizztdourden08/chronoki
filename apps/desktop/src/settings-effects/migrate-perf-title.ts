/* @layer renderer-app @kind logic */
import type { RawSettings } from './normalise-settings.type';

const migratePerfTitle = (current: boolean, raw: RawSettings): boolean => (raw.displayPerfInTitle === undefined && typeof raw.showFps === 'boolean' ? raw.showFps : current);

export { migratePerfTitle };
