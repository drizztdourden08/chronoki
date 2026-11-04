/* @layer renderer-components @kind constants */
import type { StoredOffset } from './DebugFloatingControls.type';

const STORAGE_KEY = 'debugFloatingControls.offset';

const DEFAULT_OFFSET: StoredOffset = { top: 96, right: 24 };

const MIN_OFFSET = 4;

const CAPTURE_START_LABEL = 'Start a debug capture';

const CAPTURE_STOP_LABEL = 'Stop the debug capture';

const REPORT_LABEL = 'Report a bug, with a chance to attach a debug capture';

export { CAPTURE_START_LABEL, CAPTURE_STOP_LABEL, DEFAULT_OFFSET, MIN_OFFSET, REPORT_LABEL, STORAGE_KEY };
