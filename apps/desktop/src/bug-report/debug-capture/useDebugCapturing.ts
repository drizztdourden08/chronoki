/* @layer renderer-lib @kind hook */
import { useSyncExternalStore } from 'react';
import { debugCaptureStore } from './debug-capture-store';

const useDebugCapturing = (): boolean => useSyncExternalStore(debugCaptureStore.subscribe, debugCaptureStore.get);

export { useDebugCapturing };
