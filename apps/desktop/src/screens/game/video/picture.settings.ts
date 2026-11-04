/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = {
  title: 'Picture',
  icon: 'image',
  order: 1,
  keywords: ['picture', 'widescreen', 'aspect', 'scale', 'resolution', 'interpolation', 'sync', 'fps'],
};

const aspects = [
  { value: '16:9', label: '16:9' },
  { value: '16:10', label: '16:10' },
  { value: '21:9', label: '21:9' },
];

const sections: Section[] = [
  {
    id: 'widescreen',
    title: 'Widescreen',
    items: [
      gateItem('widescreen'),
      {
        key: 'widescreenAspect',
        label: 'Widescreen aspect',
        description: 'The shape of the wide picture.',
        hint: 'Needs Widescreen. 16:9 suits most screens.',
        control: { kind: 'choice', options: aspects },
      },
      gateItem('sceneAdjust'),
      gateItem('wideSteamMargins'),
      gateItem('fillBottomLine'),
    ],
  },
  {
    id: 'resolution',
    title: 'Resolution',
    items: [
      gateItem('renderScale'),
      {
        key: 'renderScale',
        label: 'Render scale',
        description: 'Draw the picture at 2 to 4 times the SNES size.',
        hint: 'Needs Internal resolution. Higher is sharper and needs a faster computer.',
      },
    ],
  },
  {
    id: 'performance',
    title: 'Performance',
    items: [gateItem('interpolate'), gateItem('freeSync')],
  },
];

export default sections;
export { meta };
