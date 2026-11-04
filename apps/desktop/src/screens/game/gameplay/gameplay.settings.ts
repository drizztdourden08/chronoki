/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Gameplay',
  icon: 'gamepad-2',
  order: 1,
  keywords: ['gameplay', 'original', 'save states', 'auto save', 'save on quit', 'turbo', 'fast forward'],
};

const asCount = (value: number): string => String(value);

const sections: Section[] = [
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
            label: 'Auto-Save Interval',
            description: 'How often a state is saved on its own.',
            hint: 'Needs Enable Auto-Save.',
          },
          {
            key: 'autoSaveMaxEntries',
            label: 'Max Auto-Save Entries',
            description: 'How many auto-saves to keep, removing the oldest first.',
            hint: 'Needs Enable Auto-Save.',
            keywords: 'auto save max limit entries prune keep',
            control: { kind: 'range', min: 1, max: 20, step: 1, format: asCount },
          },
          gateItem('saveOnQuit'),
        ],
      },
      {
        id: 'turbo',
        title: 'Turbo',
        items: [
          gateItem('turbo'),
          {
            key: 'turboSpeed',
            label: 'Turbo Speed',
            description: 'How much faster the game runs while the shortcut is held, from 1.25x up to 10x.',
            hint: 'Needs Turbo on.',
            keywords: 'turbo speed fast forward multiplier',
          },
        ],
      },
    ],
  },
  {
    id: 'mode',
    title: 'Original Mode',
    items: [
      {
        key: 'original',
        label: 'Original Mode',
        description: 'Forces off every enhancement, so the game plays exactly as released. Your choices are kept for when you turn it off.',
      },
    ],
  },
];

export default sections;
export { meta };
