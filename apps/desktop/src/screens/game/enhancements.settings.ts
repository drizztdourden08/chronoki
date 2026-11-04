/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateSections } from '@app/settings-controls/gate-sections';

const meta: ScreenMeta = {
  title: 'Enhancements',
  icon: 'sparkles',
  order: 2,
  keywords: ['original', 'widescreen', 'gates', 'mods', 'interpolation', 'scale', 'aspect', 'turbo'],
};

const aspects = [
  { value: '16:9', label: '16:9' },
  { value: '16:10', label: '16:10' },
  { value: '21:9', label: '21:9' },
];

const sections: Section[] = [
  {
    id: 'mode',
    title: 'Mode',
    items: [
      {
        key: 'original',
        label: 'Original mode',
        description: 'Play Chrono Trigger exactly as released.',
        hint: 'On, every enhancement that changes the game is switched off and locked. Your choices below are kept for when you turn it off.',
      },
    ],
  },
  ...gateSections(),
  {
    id: 'picture',
    title: 'Picture options',
    items: [
      {
        key: 'widescreenAspect',
        label: 'Widescreen aspect',
        description: 'The shape of the wide picture.',
        hint: 'Used when Widescreen is on. 16:9 suits most screens.',
        control: { kind: 'choice', options: aspects },
      },
      {
        key: 'renderScale',
        label: 'Render scale',
        description: 'Draw the picture at 2 to 4 times the SNES size.',
        hint: 'Used when Render scale is on. Higher is sharper and needs a faster computer.',
      },
    ],
  },
  {
    id: 'saves',
    title: 'Save options',
    items: [
      {
        key: 'autoSaveIntervalSeconds',
        label: 'Auto-save interval',
        description: 'How often a state is saved on its own.',
        hint: 'Used when Auto-save is on. The latest five auto-saves are kept.',
      },
    ],
  },
];

export default sections;
export { meta };
