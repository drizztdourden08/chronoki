/* @layer electron-main @kind logic */
import { existsSync } from 'node:fs';
import { DRIVE_LETTERS } from './steam-detect.constants';

const listDrives = (): string[] => [...DRIVE_LETTERS].map((letter) => `${letter}:\\`).filter((drive) => existsSync(drive));

export { listDrives };
