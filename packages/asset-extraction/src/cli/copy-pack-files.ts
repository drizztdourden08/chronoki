/* @layer shared-asset-extraction @kind logic */
import type { WorkStore } from '../pipeline/work-store.type';
import { createFsWorkStore } from './fs-work-store';
import { PACK_FILES } from './import-main.constants';

const copyPackFiles = async (work: WorkStore, outDirInWork: string, target: string): Promise<string[]> => {
  const out = createFsWorkStore(target);
  const copied: string[] = [];
  for (const name of PACK_FILES) {
    const bytes = await work.readBytes(`${outDirInWork}/${name}`);
    if (bytes === null) continue;
    await out.writeBytes(name, bytes);
    copied.push(name);
  }
  return copied;
};

export { copyPackFiles };
