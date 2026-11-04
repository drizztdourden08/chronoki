/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Gameplay',
  icon: 'gamepad-2',
  order: 1,
  keywords: ['gameplay', 'original', 'save states', 'auto save', 'save on quit', 'turbo', 'fast forward'],
};

const sections: Section[] = [
  {
    id: 'mode',
    title: 'Mode',
    items: [
      {
        key: 'original',
        label: 'Original mode',
        description: 'Play Chrono Trigger exactly as released.',
        hint: 'On, every enhancement that changes the game is switched off and locked. Your choices are kept for when you turn it off.',
      },
    ],
  },
  {
    id: 'game-flow',
    title: 'Game Flow',
    subsections: [
      { id: 'save-states', title: 'Save States', items: [gateItem('saveStates')] },
      {
        id: 'save-auto',
        title: 'Auto-Save',
        items: [
          gateItem('autoSave'),
          {
            key: 'autoSaveIntervalSeconds',
            label: 'Auto-save interval',
            description: 'How often a state is saved on its own.',
            hint: 'Needs Auto-save.',
          },
          gateItem('saveOnQuit'),
        ],
      },
      { id: 'turbo', title: 'Turbo', items: [gateItem('turbo')] },
    ],
  },
];

export default sections;
export { meta };
