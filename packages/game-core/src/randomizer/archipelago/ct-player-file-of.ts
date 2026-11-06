/* @layer bridge-wasm @kind logic */
import { playerFileOf } from '@drizztdourden08/brock-randomizer/archipelago';
import type { ExportedOption, PlayerFile } from '@drizztdourden08/brock-randomizer/archipelago';
import { withCtOptionDefaults } from '../world/with-ct-option-defaults';
import { AP_GAME } from './ap-game.constants';
import { ctOptionRows } from './ct-option-rows';
import { ctPlayerValuesOf } from './ct-player-values-of';
import { ctPreRolledOf } from './ct-pre-rolled-of';
import type { CtPlayerFileInput } from './ct-player-file-input.type';

const KIT_INPUT_KEYS: ReadonlySet<string> = new Set(['pre_rolled', 'seed_text']);

const rowDefaultsOf = (rows: readonly ExportedOption[]): Record<string, unknown> =>
  Object.fromEntries(rows.filter((row) => !KIT_INPUT_KEYS.has(row.key)).map((row) => [row.key, row.default]));

const ctPlayerFileOf = (input: CtPlayerFileInput): PlayerFile => {
  const { seedText } = input;
  const world = { ...input.world, options: withCtOptionDefaults(input.world.options) };
  const preRolled = input.preRolled ?? (seedText === undefined ? undefined : { ...ctPreRolledOf(world, seedText) });
  const schemaRows = input.schemaRows ?? ctOptionRows();
  return playerFileOf({
    game: AP_GAME,
    schemaRows,
    values: ctPlayerValuesOf({ ...rowDefaultsOf(schemaRows), ...world.options }, schemaRows),
    ...(input.slotName === undefined ? {} : { slotName: input.slotName }),
    ...(input.appVersion === undefined ? {} : { appVersion: input.appVersion }),
    ...(seedText === undefined ? {} : { seedText }),
    ...(input.deathLink === undefined ? {} : { deathLink: input.deathLink }),
    ...(preRolled === undefined ? {} : { preRolled }),
  });
};

export { ctPlayerFileOf };
