/* @layer renderer-appshell @kind hook */
import { useSyncExternalStore } from 'react';
import { replanStore } from '@app/game/lifecycle';

const useReplanning = (): boolean => useSyncExternalStore(replanStore.subscribe, replanStore.get);

export { useReplanning };
