/* @layer shared-asset-extraction @kind logic */
import { effectFrameStreams } from './effect-frame-streams';

const stageStreams = (rom: Uint8Array): Map<string, Set<number>> =>
  new Map([['battle effect frames ($D1 words, C1/486A)', effectFrameStreams(rom)]]);

export { stageStreams };
