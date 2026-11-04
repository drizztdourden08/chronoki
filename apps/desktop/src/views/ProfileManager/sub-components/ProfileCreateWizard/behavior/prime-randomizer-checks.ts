/* @layer renderer-components @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import { primeChecksFromRom } from '@app/game/randomizer';
import { NO_PACK_ERROR } from '../ProfileCreateWizard.constants';

const primeRandomizerChecks = async (config: RandomizerProfileConfig | undefined, romFile: string): Promise<void> => {
  if (config === undefined) return;
  if (!(await primeChecksFromRom(romFile))) throw new Error(NO_PACK_ERROR);
};

export { primeRandomizerChecks };
