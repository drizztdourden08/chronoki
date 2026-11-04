/* @layer renderer-app @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';
import type { AppMaps } from './app-ipc-maps.type';

const requireAppApi = () => requireHostApi<AppMaps>();

export { requireAppApi };
