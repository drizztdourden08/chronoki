/* @layer renderer-components @kind hook */
import { useSyncExternalStore } from 'react';
import { saveOverlayStore } from '@app/game/save-overlay';
import type { SaveOverlayState } from '@app/game/save-overlay';

const useSaveOverlay = (): SaveOverlayState => useSyncExternalStore(saveOverlayStore.subscribe, saveOverlayStore.get);

export { useSaveOverlay };
