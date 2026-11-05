/* @layer bridge-wasm @kind logic */
import { createMsuStore } from '@drizztdourden08/brock-msu/renderer';
import type { MsuStore } from '@drizztdourden08/brock-msu/renderer';
import { platformFiles } from '@app/storage/platform-files';
import { chronokiMsuStudio } from './chronoki-msu-studio';

let store: MsuStore | null = null;

const chronokiMsuStore = (): MsuStore => {
  store ??= createMsuStore(chronokiMsuStudio, { files: platformFiles() });
  return store;
};

export { chronokiMsuStore };
