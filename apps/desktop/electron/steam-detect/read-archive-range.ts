/* @layer electron-main @kind logic */
import { open } from 'node:fs/promises';
import { detectSession } from './detect-session';

const read = async (path: string, offset: number, length: number): Promise<Uint8Array> => {
  const handle = await open(path, 'r');
  try {
    const buffer = new Uint8Array(length);
    const { bytesRead } = await handle.read(buffer, 0, length, offset);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
};

const readArchiveRange = async (path: string, offset: number, length: number): Promise<Uint8Array> => {
  if (path !== detectSession.allowed) throw new Error('That file was not chosen in this session.');
  return read(path, offset, length);
};

export { readArchiveRange };
