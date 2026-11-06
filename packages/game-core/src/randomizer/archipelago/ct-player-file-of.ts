/* @layer bridge-wasm @kind logic */
import { playerFileOf } from '@drizztdourden08/brock-randomizer/archipelago';
import type { PlayerFile } from '@drizztdourden08/brock-randomizer/archipelago';
import { AP_GAME } from './ap-game.constants';
import { ctOptionRows } from './ct-option-rows';
import { ctPlayerValuesOf } from './ct-player-values-of';
import { ctPreRolledOf } from './ct-pre-rolled-of';
import type { CtPlayerFileInput } from './ct-player-file-input.type';

const ctPlayerFileOf = (input: CtPlayerFileInput): PlayerFile => {
  const { world, seedText } = input;
  const preRolled = input.preRolled ?? (seedText === undefined ? undefined : { ...ctPreRolledOf(world, seedText) });
  const schemaRows = input.schemaRows ?? ctOptionRows();
  return playerFileOf({
    game: AP_GAME,
    schemaRows,
    values: ctPlayerValuesOf(world.options ?? {}, schemaRows),
    ...(input.slotName === undefined ? {} : { slotName: input.slotName }),
    ...(input.appVersion === undefined ? {} : { appVersion: input.appVersion }),
    ...(seedText === undefined ? {} : { seedText }),
    ...(input.deathLink === undefined ? {} : { deathLink: input.deathLink }),
    ...(preRolled === undefined ? {} : { preRolled }),
  });
};

export { ctPlayerFileOf };
