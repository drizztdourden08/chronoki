/* @layer renderer-app @kind logic */
import { createElement } from 'react';
import { defineBootTask } from '@drizztdourden08/brock-react';
import { ChecksView, addRandomizerPages } from '@drizztdourden08/brock-randomizer/renderer';
import { hostGate } from '@chronoki/game-core';
import { RANDOMIZER_GATE } from '@app/game/randomizer';
import { rememberProfileChecks } from '@app/game/randomizer/tracker/remember-profile-checks';

export default defineBootTask({
  label: 'Loading the randomizer tracker',
  after: ['settings'],
  run: async ({ report, profile }) => {
    addRandomizerPages([{
      key: 'tracker',
      title: 'Tracker',
      icon: 'list',
      when: () => hostGate(RANDOMIZER_GATE),
      render: () => createElement(ChecksView, { prefKey: 'tracker' }),
    }]);
    await rememberProfileChecks(profile?.id ?? null).catch(() => undefined);
    report(1);
  },
});
