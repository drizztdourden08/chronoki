/* @layer electron-main @kind logic */
import { readFile, readdir, stat } from 'node:fs/promises';
import type { ScanFs } from './steam-detect.type';

const nodeScanFs: ScanFs = {
  readDir: async (dir) =>
    (await readdir(dir, { withFileTypes: true })).map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory(), isLink: entry.isSymbolicLink() })),
  isFile: async (path) => (await stat(path).catch(() => null))?.isFile() === true,
  readText: async (path) => readFile(path, 'utf8').catch(() => null),
};

export { nodeScanFs };
