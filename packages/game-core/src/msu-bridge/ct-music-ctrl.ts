/* @layer bridge-wasm @kind logic */
import { CMD_PLAY, CMD_RESUME } from './msu-bridge.constants';
import type { RawMusicCommand } from './music-state.type';

const ctrlOfCommand = (command: RawMusicCommand): number | null =>
  command.cmd === CMD_PLAY || command.cmd === CMD_RESUME ? command.p1 : null;

export { ctrlOfCommand };
