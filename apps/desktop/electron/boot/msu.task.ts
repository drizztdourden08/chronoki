/* @layer electron-main @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-electron/main';
import { configureMsuMain } from '@drizztdourden08/brock-msu/main';
import { ctMsuConfig } from '@chronoki/game-core/msu-config';

export default defineBootTask({
  label: 'Configuring the music pack module',
  run: (ctx) => {
    configureMsuMain(ctx, { game: ctMsuConfig });
    ctx.report(1);
  },
});
