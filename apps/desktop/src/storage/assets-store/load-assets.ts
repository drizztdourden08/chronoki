/* @layer renderer-lib @kind logic */
import { platformFiles } from '../platform-files';
import { romStoreOf } from '../rom-files';

const loadAssets = async (romFile: string): Promise<ArrayBuffer | null> => {
  const files = platformFiles();
  const target = romStoreOf(files).assetFileOf(romFile);
  const bytes = target ? await files.readBytes(target) : null;
  if (!bytes || bytes.length === 0) return null;
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
};

export { loadAssets };
