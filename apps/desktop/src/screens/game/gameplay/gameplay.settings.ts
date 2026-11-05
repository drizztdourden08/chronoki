/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Gameplay',
  icon: 'gamepad-2',
  order: 1,
  keywords: ['gameplay', 'vanilla safe', 'save states', 'auto save', 'save on quit', 'turbo', 'fast forward'],
};

const asSeconds = (value: number): string => `${value} s`;

const asMinutes = (seconds: number): string => (seconds >= 60 ? `${Math.floor(seconds / 60)}m` : `${seconds}s`);

const asCount = (value: number): string => String(value);

const sections: Section[] = [
  {
    id: 'game-flow',
    title: 'Game Flow',
    subsections: [
      {
        id: 'save-auto',
        title: 'Auto-Save',
        items: [
          gateItem('autoSave'),
          {
            key: 'autoSaveIntervalSeconds',
            label: 'Auto-Save Interval',
            description: 'How often to create an automatic save',
            hint: 'Needs Enable Auto-Save.',
            keywords: 'auto save interval time frequency',
            control: { kind: 'range', min: 60, max: 1800, step: 60, format: asMinutes },
          },
          {
            key: 'autoSaveMaxEntries',
            label: 'Max Auto-Save Entries',
            description: 'Maximum number of auto-saves to keep (oldest are pruned)',
            hint: 'Needs Enable Auto-Save.',
            keywords: 'auto save max limit entries prune keep',
            control: { kind: 'range', min: 1, max: 20, step: 1, format: asCount },
          },
          gateItem('saveOnQuit'),
        ],
      },
      {
        id: 'save-shortcuts',
        title: 'Quick Save Shortcuts',
        items: [
          gateItem('enhancedSaveSlotShortcut'),
          {
            key: 'saveHoldDuration',
            label: 'Hold to Save Duration',
            description: 'How long to hold the key to save (seconds)',
            hint: 'Needs Enhanced Save Slot Shortcut.',
            keywords: 'save hold duration time seconds',
            control: { kind: 'range', min: 1, max: 5, step: 0.5, format: asSeconds },
          },
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
    id: 'quality-of-life',
    title: 'Quality of Life',
    items: [
      gateItem('sightscope'),
      gateItem('sightscopeBosses'),
      gateItem('visibleTechList'),
      gateItem('fastTabs'),
      gateItem('treasureTierMarkers'),
      gateItem('zenanAltMusic'),
      gateItem('deathPeakAltMusic'),
    ],
  },
  {
    id: 'vanilla-safe',
    title: 'Vanilla Safe',
    items: [
      {
        key: 'vanillaSafe',
        label: 'Vanilla Safe',
        description: 'Forces off every enhancement, so the game plays exactly as released. Your choices are kept for when you turn it off.',
        keywords: 'vanilla safe parity original stock speedrun race lock',
      },
    ],
  },
];

export default sections;
export { meta };
