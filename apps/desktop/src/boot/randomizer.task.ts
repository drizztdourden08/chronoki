/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';
import { registerRandomizerGame } from '@drizztdourden08/brock-randomizer/renderer';
import { chronokiRandomizerGame } from '@app/game/randomizer';

export default defineBootTask({
  label: 'Registering the randomizer',
  run: ({ report }) => {
    registerRandomizerGame(chronokiRandomizerGame);
    report(1);
  },
});
