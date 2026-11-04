/* @layer renderer-app @kind config */
import { defineScreens } from '@drizztdourden08/brock-react';

export default defineScreens({
  buckets: [
    { id: 'game', title: 'Game', icon: 'gamepad-2', menu: 'entry', groups: [{ id: 'gameplay', label: 'Gameplay' }] },
    {
      id: 'data',
      title: 'Data',
      icon: 'archive',
      menu: 'submenu',
      requiresProfile: false,
      groups: [{ id: 'library', label: 'Library' }],
    },
  ],
  home: 'game',
});
