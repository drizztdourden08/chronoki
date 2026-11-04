/* @layer renderer-lib @kind logic */
import JSZip from 'jszip';
import type { MsuSourceFile } from './msu-store.type';

const unzipFiles = async (bytes: Uint8Array): Promise<MsuSourceFile[]> => {
  const zip = await JSZip.loadAsync(bytes);
  const out: MsuSourceFile[] = [];
  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    out.push({ name: entry.name.split('/').pop() ?? entry.name, bytes: await entry.async('uint8array') });
  }
  return out;
};

export { unzipFiles };
